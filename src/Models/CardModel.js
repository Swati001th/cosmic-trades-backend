const mongoose = require('mongoose');

const userCardSchema = new mongoose.Schema({
    
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        // required: true
        default:null
    },

    cardNumber: {
        type: Number,
        default:0

    },
    holderName: {
        type: String,
        required: true
    },
    cardExp: {
        type: String,
        required: true
   
    },
}, {
    timestamps: true,
    versionKey: false
});


const userCardModel = mongoose.model('userCard', userCardSchema);
module.exports = { userCardModel };