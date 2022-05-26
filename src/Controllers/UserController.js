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
const UserModel  = require("../Models/UserModel");
exports.login = async(req,res)=>{
    try {
        const schema = Joi.object().keys({
            userName: Joi.string().required(),       
            password: Joi.string().required(),      
        })
        let da = await schema.validateAsync(req.body);
        let data =  req.body;
        var accessToken = auth.generateToken();
        let userExist = await UserModel.findOne({
            userName: data.userName,
   
        }).lean();
        if (!userExist || userExist == null) {
            throw new Error("User Name does not exist."); 
       
        }
        let checkPass = await utill.compare(data.password, userExist.password);
        console.log(checkPass,"::::::::::::::::::::::::::password");
        let  userDetails = null
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
                    deviceType:data.device_type
                },
                },
                { new: true }
            ).lean();
        
        } else {
            throw new Error("Password does not match.");  
       
        }
        
        res.status(200).json({ response: userDetails, message: "success" });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

exports.userSignup = async(req, res) => {

    try {
        const schema = Joi.object().keys({
            firstName: Joi.string().min(3).required(),
            lastName: Joi.string().min(3).required(),
            userName: Joi.string().alphanum().min(3).max(30).required(),
            password: Joi.string().required(),         
            email: Joi.string().min(8).email({ minDomainSegments: 2, tlds: { allow: ['com', 'net','in','io'] } }).required(),
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
            "coordinates": [req.body.latitude, req.body.longitude, ]
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
        var accessToken  = auth.generateToken();
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
        }
        let Data = { firstName, lastName, mobileNumber, deposite, address, userName, location, longitude, latitude, countryCode, accessToken, verificationCode, deviceToken, email, deviceType, userType, password: encPassword,refferalCode:refferalCode };

        let user = new UserModel(Data);
        let userDetails = await user.save();
        var findUser = await UserModel.findById({ _id: userDetails._id }, {}, { lean: true })
        if (!userDetails) {
            throw new Error('Unable to add details.')
        }
        // let findUser = await UserModel.deleteMany();
        res.status(200).json({ response: userDetails, message: 'Signup Successfully' });


    } catch (error) {
        console.log(error)
        res.status(403).json({ message: error.message });
    }

}

exports.emailVerify =  async(req,res)=>{
    try {
        const schema = Joi.object().keys({
            verficationCode: Joi.string().required(),      
            emailId: Joi.string().required(),      
        })
        let da = await schema.validateAsync(req.body);
        let userId = req.userData._id
        let email = req.userData.emailId
        let verificationCode = req.userData.verificationCode
        let otmMsg =null;
        console.log(verificationCode)
        if(req.body.email == email){
            if(verificationCode == req.body.verficationCode){

                otmMsg = "verification success !!";
            }else{
                throw new Error('Invalid verificationCode .')
            }
        }else{
            throw new Error('Invalid Email .')
        }
        console.log(userId)
      
        res.status(200).json({ response: otmMsg, message: 'Success' });
    } catch (error) {
        console.log(error)
        res.status(403).json({ message: error.message }); 
    }
}