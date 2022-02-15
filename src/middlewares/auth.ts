import { NextFunction, Request, Response } from "express"
const logger = require('../logger')
const { verifyToken } = require('../helpers/jwt')

const authorization = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { access_token: token } = req.headers

    if (!token) {
      logger.error('InvalidInput')
    }

    const user = verifyToken(token)
    if (user.userId !== req.body.userId) {
      res.status(404).send({
        message: "User not found",

      })
    }
    next()
  } catch (error) {
    logger.error(error) 
    next(error)   
  }
}

module.exports = authorization;