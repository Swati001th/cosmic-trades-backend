const responses = require('./responses');
const UserModel = require('../Models/UserModel')
const jwt = require("jsonwebtoken");
const config = require("../Helpers/config");

exports.userAuthentication = async (req, res, next) => {
    let { access_token } = req.headers;
    if (access_token) {
        // console.log("access_token : ",access_token);
        jwt.verify(access_token, config.JWT_PRIVATE_KEY, async function (err, decoded) {
            if (!err) {
                let user = await UserModel.findOne({ access_token: access_token })
                if (!user) {
                    res.status(401).json({ status: 400, message: "Invalid access_token, please relogin to access this feature."});
                    return;
                }
                req.userData = user;
                next();
            } else {
                res.status(401).json({message: "Enter a valid access token"});
                return;
            }
        })
    } else {
        res.status(500).json({message: "access_token missing"});
    }
}


exports.generateToken = () => {
    // let token = jwt.sign({ access: 'access-' }, config.JWT_PRIVATE_KEY, { expiresIn: '2 days' });
    let token = jwt.sign({ access: 'access-' }, config.JWT_PRIVATE_KEY, {});
    return token;
}