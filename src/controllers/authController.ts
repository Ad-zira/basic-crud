import { Request, Response, NextFunction } from "express";
const logger = require('../logs')
// const User = require('../models/User')

class authController {
  static async loginService(req: Request, res: Response, next: NextFunction) {
    try {
      
    } catch (error) {
      logger.error(error)
    }
  }

  static async registerService(req: Request, res: Response, next: NextFunction) {
    try {
      
    } catch (error) {
      logger.error(error)
    }
  }

  static async getAllEmployees(req: Request, res: Response, next: NextFunction) {
    try {
      
    } catch (error) {
      logger.error(error)
    }
  }

  static async validateEmployee(req: Request, res: Response, next: NextFunction) {
    try {
      
    } catch (error) {
      logger.error(error)
    }
  }

  static async updateEmployee(req: Request, res: Response, next: NextFunction) {
    try {
      
    } catch (error) {
      logger.error(error)
    }
  }

  static async removeEmployee(req: Request, res: Response, next: NextFunction) {
    try {
      
    } catch (error) {
      logger.error(error)
    }
  }

}

export default authController;