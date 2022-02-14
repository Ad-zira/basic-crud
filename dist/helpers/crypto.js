"use strict";
const cryptojs = require("crypto-js");
const encrypt = (password, CRYPTOSECRET) => {
    return cryptojs.AES.encrypt(password, CRYPTOSECRET).toString();
};
const decrypt = (password, CRYPTOSECRET) => {
    return cryptojs.AES.decrypt(password, CRYPTOSECRET).toString(cryptojs.enc.Utf8);
};
module.exports = {
    encrypt,
    decrypt,
};
