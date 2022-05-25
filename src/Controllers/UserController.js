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
            mobileNumber: Joi.string().required(),
            countryCode: Joi.string().required(),
            password: Joi.string().required(),
      
        })
        let da = await schema.validateAsync(req.body);
        let data =  req.body;
        var accessToken = auth.generateToken();
        let userExist = await UserModel.findOne({
        countryCode: data.countryCode,
        mobileNumber: Number(data.mobileNumber),
        }).lean();
        if (!userExist || userExist == null) {
            throw new Error("Mobile Number does not exist."); 
       
        }
        let checkPass = await utill.compare(data.password, userExist.password);
        console.log(checkPass,"::::::::::::::::::::::::::password");
        let  userDetails = null
        if (checkPass) {
            userDetails = await UserModel.findOneAndUpdate(
                {
                countryCode: data.countryCode,
                mobileNumber: Number(data.mobileNumber),
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
            mobileNumber: Joi.string().required(),
            countryCode: Joi.string().required(),
            email: Joi.string().allow("").optional(),
            password: Joi.string().required(),         
            deviceType: Joi.number().required(),
            userType: Joi.number().required(),
        })
        let da = await schema.validateAsync(req.body);
        
        req.body.longitude = 77.7440948;
        req.body.latitude = 27.4642568;
        let location = {
            type: 'Point',
            "coordinates": [req.body.latitude, req.body.longitude, ]
        }
        var {          
            password,
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
            let userData = await UserModel.findOne({ $and: [{ "mobileNumber": mobileNumber }, { "countryCode": countryCode }, { "userType": userType }] })
            if (userData) {
                throw new Error("Mobile Number Already Exit");        
            }
        }
        let Data = { mobileNumber, location, longitude, latitude, countryCode, accessToken, verificationCode, deviceToken, email, deviceType, userType, password: encPassword,refferalCode:refferalCode };

        let user = new UserModel(Data);
        let userDetails = await user.save();
        var findUser = await UserModel.findById({ _id: userDetails._id }, {}, { lean: true })
        if (!userDetails) {
            throw new Error('Unable to add details.')
        }
        // let findUser = await UserModel.deleteMany();
        res.status(200).json({ response: findUser, message: 'Signup Successfully' });


    } catch (error) {
        console.log(error)
        res.status(403).json({ message: error.message });
    }

}

exports.verifyOtp =  async(req,res)=>{
    try {

        
        let otmMsg = "this is otp msg ";
        console.log("this opt send :::::")
        res.status(200).json({ response: otmMsg, message: 'Success' });
    } catch (error) {
        console.log(error)
        res.status(403).json({ message: error.message }); 
    }
}