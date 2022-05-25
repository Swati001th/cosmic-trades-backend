const bcrypt = require('bcryptjs');
const saltRounds = 10;

exports.encryptText = async (plaintext) => {
    let encryptedPass = await bcrypt.hash(plaintext, saltRounds);
    return encryptedPass;
}


exports.compare = async (plaintext, encryptText) => {
    let matched = await bcrypt.compare(plaintext, encryptText);
    return matched;
}