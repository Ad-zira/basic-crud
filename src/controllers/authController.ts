import { Request, Response, NextFunction } from "express";
const logger = require('../logs')
// const User = require('../models/User')

class authController {
  static async loginService(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).send({
        success: true,
        message: 'Welcome to the login service',
        version: '1.0.0'
      })
    } catch (error) {
      logger.error(error)
    }
  }

  static async registerService(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).send({
        success: true,
        message: 'Welcome to the Register service',
        version: '1.0.0'
      })
    } catch (error) {
      logger.error(error)
    }
  }

  static async getAllEmployees(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).send({
        success: true,
        message: 'Getting all the employees',
      })
    } catch (error) {
      logger.error(error)
    }
  }

  static async validateEmployee(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).send({
        success: true,
        message: 'Welcome to the Employee Validation service',
        version: '1.0.0'
      })
    } catch (error) {
      logger.error(error)
    }
  }

  static async updateEmployee(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).send({
        success: true,
        message: 'Welcome to the update Employee Service',
        version: '1.0.0'
      })
    } catch (error) {
      logger.error(error)
    }
  }

  static async removeEmployee(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(204).send({
        success: true,
        message: 'Employee deleted',
      })
    } catch (error) {
      logger.error(error)
    }
  }

}

module.exports = authController;