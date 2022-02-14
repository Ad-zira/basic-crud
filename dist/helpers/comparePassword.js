"use strict";
const bcryptjs = require("bcryptjs");
const saltedPass = Number(process.env.GEN_SALT_SYNC);
const hashPassword = (password) => {
    return bcryptjs.hashSync(password, saltedPass);
};
const comparePassword = (password, hash) => {
    return bcryptjs.compareSync(password, hash);
};
module.exports = { comparePassword };
