"use strict";
const jwt = require('jsonwebtoken');
const JWTSECRET = process.env.JWT_SECRET;
const signToken = (payload) => {
    return jwt.sign(payload, JWTSECRET);
};
const verifyToken = (token) => {
    return jwt.verify(token, JWTSECRET);
};
module.exports = {
    signToken,
    verifyToken
};
