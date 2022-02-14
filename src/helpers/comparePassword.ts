const bcryptjs = require("bcryptjs");
const comparePassword = (password:String, hash:any) => {
	return bcryptjs.compareSync(password, hash);
};

module.exports = {comparePassword}