const mongoose = require("mongoose");
const Joi = require("joi");
const status = require("../Modules/status");
const bcrypt = require("bcryptjs");
const common = require("../Modules/commonFunctions");
const country = require("country-state-city").default;
const jwt = require("jsonwebtoken");
const config = require("../Helpers/config");
const auth = require("../Modules/auth");
const utill = require("../Modules/utill");
const UserModel = require("../Models/UserModel");
const AboutModel = require("../Models/AboutModel");
var API = require('indian-stock-exchange');
const { findByIdAndUpdate } = require("../Models/UserModel");

var NSEAPI = API.NSE;
var BSEAPI = API.BSE;
exports.login = async (req, res) => {
    try {
        const schema = Joi.object().keys({
            userName: Joi.string().required(),
            password: Joi.string().required(),
        })
        let da = await schema.validateAsync(req.body);
        let data = req.body;
        var accessToken = auth.generateToken();
        let userExist = await UserModel.findOne({
            userName: data.userName,

        }).lean();
        if (!userExist || userExist == null) {
            throw new Error("User Name does not exist.");

        }
        let checkPass = await utill.compare(data.password, userExist.password);
        console.log(checkPass, "::::::::::::::::::::::::::password");
        let userDetails = null
        if (checkPass) {
            userDetails = await UserModel.findOneAndUpdate(
                {
                    // countryCode: data.countryCode,
                    userName: data.userName,
                },
                {
                    $set: {
                        accessToken: accessToken,
                        deviceToken: data.device_token,
                        deviceType: data.device_type
                    },

                },
                {
                    "fields": { fullName: 0, dob: 0, onlineStatus: 0, isApproved: 0, isProfileCreated: 0, isTermAccept: 0, isBlock: 0, socialType: 0, userPermission: 0, latitude: 0, longitude: 0, location: 0 },
                    "new": true
                }
            ).lean();

        } else {
            throw new Error("Password does not match.");

        }

        res.status(200).json({ responseCode: 2000, message: "success", data: userDetails, });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

exports.changePassword = async (req, res) => {
    try {
        const schema = Joi.object().keys({
            currentPassword: Joi.string().required(),
            setNewpassword: Joi.string().required(),
        })
        let da = await schema.validateAsync(req.body);
        let data = req.body;
        let userId = req.userData._id
        let userExist = await UserModel.findOne({
            _id: userId,

        }).lean();
        if (!userExist || userExist == null) {
            throw new Error("In valid user ");

        }
        let checkPass = await utill.compare(data.currentPassword, userExist.password);
        console.log(checkPass, "::::::::::::::::::::::::::password");
        let userDetails = null
        if (checkPass) {
            let encPassword = await utill.encryptText(data.setNewpassword);
            userDetails = await UserModel.findByIdAndUpdate(userId, { $set: { password: encPassword }, }, {
                "fields": { fullName: 0, dob: 0, onlineStatus: 0, isApproved: 0, isProfileCreated: 0, isTermAccept: 0, isBlock: 0, socialType: 0, userPermission: 0, latitude: 0, longitude: 0, location: 0 },
                "new": true
            }, 
            ).lean();

        } else {
            throw new Error("Password does not match.");

        }

        res.status(200).json({ responseCode: 2000, message: "success", data: userDetails });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
exports.varifyPassword = async (req, res) => {
    try {
        const schema = Joi.object().keys({
        Newpassword: Joi.string().required(),
        email:Joi.string().required(),
        })
        let da = await schema.validateAsync(req.body);
        let data = req.body;
        // let userId = req.userData._id
        let userExist = await UserModel.findOne({
            email: data.email,

        }).lean();
        if (!userExist || userExist == null) {
            throw new Error("In valid user ");

        }
        // let checkPass = await utill.compare(data.currentPassword, userExist.password);
        // console.log(checkPass, "::::::::::::::::::::::::::password");
        let userDetails = null
            let encPassword = await utill.encryptText(data.Newpassword);
            userDetails = await UserModel.findByIdAndUpdate(userExist._id, { $set: { password: encPassword }, }, {
                "fields": { fullName: 0, dob: 0, onlineStatus: 0, isApproved: 0, isProfileCreated: 0, isTermAccept: 0, isBlock: 0, socialType: 0, userPermission: 0, latitude: 0, longitude: 0, location: 0 },
                "new": true
            }, 
            ).lean();

      

        res.status(200).json({ responseCode: 2000, message: "success", data: userDetails });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
exports.userSignup = async (req, res) => {

    try {
        const schema = Joi.object().keys({
            firstName: Joi.string().min(3).required(),
            lastName: Joi.string().min(3).required(),
            userName: Joi.string().alphanum().min(3).max(30).required(),
            password: Joi.string().required(),
            email: Joi.string().min(8).email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'in', 'io'] } }).required(),
            countryCode: Joi.number().required(),
            mobileNumber: Joi.number().required(),
            deposite: Joi.number().required(),
            address: Joi.string().required(),
            deviceType: Joi.number().required(),
            deviceToken: Joi.string().required(),
        })
        let da = await schema.validateAsync(req.body);

        req.body.longitude = 77.7440948;
        req.body.latitude = 27.4642568;
        let location = {
            type: 'Point',
            "coordinates": [req.body.latitude, req.body.longitude,]
        }
        var {
            firstName,
            lastName,
            password,
            userName,
            deposite,
            address,
            deviceToken,
            deviceType,
            longitude,
            latitude,
            userType
        } = req.body;
        var accessToken = auth.generateToken();
        var verificationCode = common.generateRandomString()
        let email = req.body.email ? req.body.email.toLowerCase() : ''
        let countryCode = req.body.countryCode
        let mobileNumber = req.body.mobileNumber;
        let encPassword = await utill.encryptText(password);
        let refcode = common.makeReffralCode(8)
        let refferalCode = "EVA$_" + refcode;
        if (mobileNumber != "" && mobileNumber) {
            let userData = await UserModel.findOne({ $and: [{ "mobileNumber": mobileNumber }, { "countryCode": countryCode },] })
            if (userData) {
                throw new Error("Mobile Number Already Exit");
            }
            let nameData = await UserModel.findOne({ $and: [{ "userName": userName }] })
            if (nameData) {
                throw new Error("UserName Already Exit");
            }
            let emailData = await UserModel.findOne({ $and: [{ "email":email  }] })
            if (emailData) {
                throw new Error("email Already Exit");
            }
        }
        let Data = { firstName, lastName, mobileNumber, deposite, address, userName, location, longitude, latitude, countryCode, accessToken, verificationCode, deviceToken, email, deviceType, userType, password: encPassword, refferalCode: refferalCode };

        let user = new UserModel(Data);
        let userDetails = await user.save();
        var findUser = await UserModel.findById({ _id: userDetails._id }, { fullName: 0, dob: 0, onlineStatus: 0, isApproved: 0, isProfileCreated: 0, isTermAccept: 0, isBlock: 0, socialType: 0, userPermission: 0, latitude: 0, longitude: 0, location: 0 }, { lean: true })
        if (!userDetails) {
            throw new Error('Unable to add details.')
        }
        // let findUser = await UserModel.deleteMany();
        res.status(200).json({ responseCode: 2000, message: 'Signup Successfully', data: findUser, });


    } catch (error) {
        console.log(error)
        res.status(403).json({ message: error.message });
    }

}

exports.emailVerify = async (req, res) => {
    try {
        const schema = Joi.object().keys({
            verficationCode: Joi.string().required(),
            emailId: Joi.string().required(),
        })
        let da = await schema.validateAsync(req.body);
        let userId = req.userData._id
        let email = req.userData.emailId
        let Userdata = await UserModel.findOne({ email: req.body.emailId })
        let otmMsg = null;
        // console.log(verificationCode)
        if (req.body.email == email) {
            if (Userdata.verificationCode == req.body.verficationCode) {

                otmMsg = "verification success !!";
            } else {
                throw new Error('Invalid verificationCode .')
            }
        } else {
            throw new Error('Invalid Email .')
        }
        console.log(userId)

        res.status(200).json({ responseCode: 2000, message: "success", response: otmMsg, });
    } catch (error) {
        console.log(error)
        res.status(403).json({ message: error.message });
    }
}
exports.OtpVerify = async (req, res) => {
    try {
        const schema = Joi.object().keys({
            otp : Joi.string().required(),
            emailId: Joi.string().required(),
        })
        let da = await schema.validateAsync(req.body);
        // let userId = req.userData._id
        // let email = req.userData.emailId
        let Userdata = await UserModel.findOne({ email: req.body.emailId })
        let otmMsg = null;
        // console.log(verificationCode)
        if (req.body.emailId == Userdata.email) {
            if (req.body.otp == '123456') {

                otmMsg = "verification success !!";
            } else {
                throw new Error('Invalid verificationCode .')
            }
        } else {
            throw new Error('Invalid Email .')
        }
        // console.log(userId)

        res.status(200).json({ responseCode: 2000, message: "success", response: otmMsg, });
    } catch (error) {
        console.log(error)
        res.status(403).json({ message: error.message });
    }
}
exports.logout = async (req, res) => {
    try {

        let userId = req.userData._id;
        let logoutObj = {
            deviceToken: null,
            accessToken: null,
        }
        var findUser = await UserModel.findByIdAndUpdate(userId, { $set: logoutObj },  { "fields": { fullName: 0, dob: 0, onlineStatus: 0, isApproved: 0, isProfileCreated: 0, isTermAccept: 0, isBlock: 0, socialType: 0, userPermission: 0, latitude: 0, longitude: 0, location: 0 },
        "new": true
    }, )
        res.status(200).json({ responseCode: 2000, message: "success", data: findUser, });
    } catch (error) {
        console.log(error)
        res.status(403).json({ message: error.message });
    }
}

exports.account = async (req, res) => {
    try {

        let userId = req.userData._id;

        let findUser = await UserModel.findOne({ _id: userId });
        let resObj = {
            name: findUser.firstName + " " + findUser.lastName,
            Id: findUser.refferalCode,
        }
        res.status(200).json({ responseCode: 2000, message: 'Success', data: resObj, });
    } catch (error) {
        console.log(error)
        res.status(403).json({ message: error.message });
    }
}

exports.accountDelete = async (req, res) => {
    try {

        let userId = req.userData._id;

        let findUser = await UserModel.findByIdAndDelete(userId);

        res.status(200).json({ responseCode: 2000, message: 'Success', data: findUser, });
    } catch (error) {
        console.log(error)
        res.status(403).json({ message: error.message });
    }
}

exports.aboutGet = async (req, res) => {
    try {

        // let userId = req.userData._id;

        let findUser = await AboutModel.find();

        res.status(200).json({ responseCode: 2000, message: 'Success', data: findUser, });
    } catch (error) {
        console.log(error)
        res.status(403).json({ message: error.message });
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const schema = Joi.object().keys({
            // verficationCode: Joi.string().required(),      
            emailId: Joi.string().required(),
        })
        let da = await schema.validateAsync(req.body);

        let email = req.body.emailId
        let code = 123456;
        let findUser = await UserModel.findOne({ email: email });
        let ress = null;
        if (!findUser) {
            throw new Error('Invalid email !')
        } else {
            ress = await UserModel.findByIdAndUpdate(findUser._id, { $set: { verificationCode: code } })
        }
        // let verificationCode = req.userData.verificationCode
        let otmMsg = "sent confirmation code successfully !";

        res.status(200).json({ responseCode: 2000, message: 'Success', data: otmMsg, });
    } catch (error) {
        console.log(error)
        res.status(403).json({ message: error.message });
    }
}

exports.getIndices = async (req, res) => {
    try {
        let nseIndices = null;
        indices = await BSEAPI.getIndices()
            .then(function (response) {
                console.log(response.data); //return the api data
                return response.data
            });
        let bseIndices = await BSEAPI.getIndices()
            .then(function (response) {
                return response.data;
                // console.log(response.data); //return the api data
            });
        res.status(200).json({ responseCode: 2000, message: 'Success', data: { bseIndices: bseIndices, nseIndices: nseIndices }, });

    } catch (error) {
        console.log(error)
        res.status(403).json({ message: error.message });
    }
}
