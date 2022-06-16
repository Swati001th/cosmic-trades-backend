// const { mongoose, } = require('../Services/mongooes');
const util = require('../Modules/utill')
const mongoose = require("mongoose");
const AdminSchema = new mongoose.Schema(
  {
    password: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      default: null,
    },
    firstName: {
      type: String,
      default: null,
    },
    lastName: {
      type: String,
      default: null,
    },
    gender: {
      type: String,
      default: null,
    },
    dob: {
      type: String,
      default: null,
    },
    deviceToken: {
      type: String,
      default: null,
    },
    accessToken: {
      type: String,
    },
  },
  {
    strict: true,
    collection: "admin",
    timestamps: true,
    versionKey: false,
  }
);
const AdminModel = mongoose.model("admin", AdminSchema);
module.exports = AdminModel;

async function checkUser(){
  let userdata = await AdminModel.find({});
  if (userdata.length == 0) {
    const password = await util.encryptText('admin@123')
    AdminModel.create({
      email: "admin@admin.com",
      password : password,
      firstName: "Admin",
  lastName: "trade",
  gender: "M",
    }).then((res)=>{
      console.log("res:",res)
    }).catch((err)=>{
      console.log("error:",err)
    })
  } 
}

checkUser()