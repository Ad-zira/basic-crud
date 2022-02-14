const bcryptjs = require("bcryptjs");

const saltedPass = Number(process.env.GEN_SALT_SYNC);

const hashPassword = (password: String) => {
	return bcryptjs.hashSync(password, saltedPass);
};
const comparePassword = (password:String, hash:any) => {
	return bcryptjs.compareSync(password, hash);
};

module.exports = {comparePassword}