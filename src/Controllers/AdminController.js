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
const AboutModel = require("../Models/AboutModel");
const UserModel = require("../Models/UserModel");
const AdminModel = require("../Models/adminModel");

exports.aboutAdd = async (req, res) => {
  try {
    const schema = Joi.object().keys({
      companyUrl: Joi.string().required(),
      companyMail: Joi.string().required(),
      companyPhone: Joi.string().required(),
    });
    let da = await schema.validateAsync(req.body);
    let data = req.body;
    // console.log(userId)
    let saveObj = new AboutModel(data);
    saveObj = await saveObj.save();
    res.status(200).json({ response: saveObj, message: "Success" });
  } catch (error) {
    console.log(error);
    res.status(403).json({ message: error.message });
  }
};

exports.getUserList = async (req, res) => {
  try {
    let userList = await UserModel.find({}).select("-password");
    if (userList) {
      return res.status(200).json({ response: userList, message: "Success" });
    } else {
      return res.status(203).json({ response: [], message: "Failed" });
    }
  } catch (error) {
    console.log(error);
    res.status(403).json({ message: error.message });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    let admin = await AdminModel.findOne({
        email: req.body.userName 
    })
    if (admin) {
        let isMatched = await utill.compare(req.body.password,admin.password)
        if (isMatched) {
          return res.status(200).json({ statuscode:200,response: admin, message: "Success" });
        } else {
          return res.status(201).json({ statuscode:201 ,response: admin, message: "Incorrect Password"});
        }
    } else {
      return res.status(201).json({ statuscode:201, response: admin, message: "Incorrect Username"});
    }
  } catch (error) {
    console.log(error);
    res.status(403).json({ message: error.message });
  }
};

exports.changePassword = async (req, res) => {
    try {
        let admin = await AdminModel.findOne({
            email: req.body.email 
        })

        if (admin) {
          return res.status(200).json({ response: admin, message: "Send otp successfully on email" });
        } else {
          return res.status(203).json({ response: [], message: "Not found account" });
        }
      } catch (error) {
        console.log(error);
        res.status(403).json({ message: error.message });
      }
};