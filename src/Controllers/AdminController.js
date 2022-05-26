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
const AboutModel  = require("../Models/AboutModel");


exports.aboutAdd =  async(req,res)=>{
    try {
        const schema = Joi.object().keys({
            companyUrl: Joi.string().required(),      
            companyMail: Joi.string().required(),      
            companyPhone: Joi.string().required(),      
        })
        let da = await schema.validateAsync(req.body);
        let data= req.body;
        // console.log(userId)
        let saveObj = new AboutModel(data);
        saveObj = await saveObj.save();
        res.status(200).json({ response: saveObj, message: 'Success' });
    } catch (error) {
        console.log(error)
        res.status(403).json({ message: error.message }); 
    }
}