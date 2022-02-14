const cryptojs = require("crypto-js");

const encrypt = (password: String, CRYPTOSECRET:any) => {
	return cryptojs.AES.encrypt(password, CRYPTOSECRET).toString();
};

const decrypt = (password:String, CRYPTOSECRET:any) => {
	return cryptojs.AES.decrypt(password, CRYPTOSECRET).toString(cryptojs.enc.Utf8);
};

module.exports = {
	encrypt,
	decrypt,
};
