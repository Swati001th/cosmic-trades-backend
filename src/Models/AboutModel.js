const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
    
    companyUrl: {
        type: String,     
        default:null
    },

    companyMail: {
        type: String,
        default:null

    },
    companyPhone: {
        type: String,
        required: true
    },
    socialMedia: {
        facebook:{
            type: String,     
            default:null
        },
        twitter:{
            type: String,     
            default:null
        },
        whatsapp:{
            type: String,     
            default:null
        },
        youtube:{
            type: String,     
            default:null
        },
        instagram:{
            type: String,     
            default:null
        },
   
    },
}, {
    strict: true,
    timestamps: true,
    collection: 'about',    
    versionKey: false
});


const AboutModel = mongoose.model('about', aboutSchema);
module.exports =  AboutModel ;