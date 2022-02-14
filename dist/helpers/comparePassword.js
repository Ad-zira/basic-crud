"use strict";
const bcryptjs = require("bcryptjs");
const comparePassword = (password, hash) => {
    return bcryptjs.compareSync(password, hash);
};
module.exports = { comparePassword };
