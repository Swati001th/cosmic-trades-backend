// const { mongoose, } = require('../Services/mongooes');
const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({

    mobileNumber: {
        type: String,
        default: null
    },
    countryCode: {
        type: String,
        default: null
    },
    password: {
        type: String,
        default: null
    },
    email: {
        type: String,
        default: null
    },
    fullName: {
        type: String,
        default: null
    },
    firstName: {
        type: String,
        default: null
    },
    lastName: {
        type: String,
        default: null
    },
    gender: {
        type: String,
        default: null
    },
    dob: {
        type: String,
        default: null
    },
    
    deviceToken: {
        type: String,
        default: null
    },

    deviceType: {
        type: Number, // 1 for android 2 for IOS
        default: null,
    },

    accessToken: {
        type: String
    },
    createdOn: {
        type: String,
        default: new Date().getTime()
    },
    profileImage: {
        type: String,
        default: null
    },
    
    verificationCode: {
        type: String,
        default: "1234"
    },
    otp: {
        type: String,
        default: "4321"
    },
    isMobileVerified: {
        type: String,
        default: "0",
    },
    onlineStatus: {
        type: String,
        default: "0", //0 for online 1 for offline
    },
    pushNotifications: {
        type: String,
        default: "0", //0 for enable 1 for disable
    },
    isEmailVerified: {
        type: String,
        default: "0",
    },
    isApproved: {
        type: String,
        default: "0",
    },
    
    isProfileCreated: {
        type: String,
        default: "0"
    },
    isTermAccept: {
        type: Number,
        default: 0
    },
    isBlock: {
        type: Number,
        default: 0
    },
    
    socialType: {
        type: String,
        default: "0" //1 for facebook , 2 for insta
    },
    socialId: {
        type: String
    },
    userType: {
        type: Number,
        default: 0 //1 user ,2 driver
    },
    
    userPermission: {
        type: Number,
        default: 0 
    },   
    
    bankDetail: {
        accountNumber:{
            type: String,
            default:null
        },
        accountHoldarName:{
            type: String,
            default:null
        },
        branchName:{
            type: String,
            default:null
        },
        ifscCode:{
            type: String,
            default:null
        }
    },
    cardDetails: {
        cardNumber : {
            type: String,
            default:null
        },
        cardExpiryDate : {
            type: String,
            default:null
        },
        cvv : {
            type: String,
            default:null
        },
       
    },
    
    latitude: {
        type: Number,
        require: true,
        default: 0.00
    },
    longitude: {
        type: Number,
        require: true,
        default: 0.00
    },
    location: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: [Number]
    },
    favlocation: {
        type: {
            type: String,
            default: 'Point'
        },
        address: {
            type: String,
            default: null
        },
        coordinates: [Number]
    },
    
    
    rewardPoint: {
        type: Number,
        default: 0 
    },
    refferalCode: {
        type: String,
        unique:true,
        default: null 
    },
    userPin: {
        type: Number,       
        default: 1234 
    },
    

}, {
    strict: true,
    collection: 'users',
    timestamps: true,
    versionKey: false,
    
});
UserSchema.index({ location: '2dsphere' })
const UserModel = mongoose.model('users', UserSchema);
module.exports =  UserModel 
