import { Request, Response } from "express"
const logger = require('../logs')

const authentication = async (req: Request, res: Response) => {
  try {
    const { access_token: token } = req.headers

    if (!token) {
      logger.error('InvalidInput')
    }

  } catch (error) {
    logger.error(error)    
  }
}

export default authentication;