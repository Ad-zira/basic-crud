const jwt = require('jsonwebtoken')

const JWTSECRET = process.env.JWT_SECRET || 'rahasia';

const signToken = (payload: String) => {
  return jwt.sign(payload, JWTSECRET)
}

const verifyToken = (token:any) => {
  return jwt.verify(token, JWTSECRET)
}

module.exports = {
  signToken,
  verifyToken
}