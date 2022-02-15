import { Request, Response, NextFunction } from "express";
import { pathToFileURL } from "url";
import winston, {createLogger, format, loggers} from "winston";
const { 
  simple, 
  combine, 
  json, 
  prettyPrint,  
  errors, 
  printf, 
  colorize 
} = format;

// const logger = require('../logger')
const {signToken, verifyToken} = require('../helpers/jwt')
const auth = require('../middlewares/auth')
const pool = require('../db/db')
const randomNumber = require('../helpers/randomGenerate')
const {encrypt, decrypt} = require('../helpers/crypto')

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack||message}`;
});

let logger = createLogger({
  exitOnError: false,
  level: 'debug',
  transports: [
    new winston.transports.File({ 
      filename: 'logging/controller.log',
      format: combine(
        // colorize(),
        json(), 
        prettyPrint(), 
        errors({stack: true}),
        logFormat
      ),
    }),
    new winston.transports.Console({
      format: combine(
        colorize(),
        simple(),
        logFormat
      )
    })
  ],
  exceptionHandlers: [
    new winston.transports.File({ 
      filename: 'logging/exceptions.log',
      level: 'http',
      format: logFormat
    }),
    new winston.transports.Console({
      format: combine(
        colorize(),
        simple(),
        errors({stack: true}),
        logFormat
      )
    })
  ]
})

class userController {
  static async loginService(req: Request, res: Response, next: NextFunction) {
    try {
      const {email, password} = req.body;

      const foundUser = await pool.query('SELECT * FROM employees WHERE email = $1', [`${email}`])
      
      const foundUserInfo = foundUser.rows[0]
      
      if (!foundUserInfo) {
        logger.warn('Email not registered')
        return res.status(404).json({
          code: "ERR4001",
          message: "Email not registered",
          type: "Not found"
        })
      } 
      if (!password || password !== foundUserInfo.password) {
        logger.info("Wrong password")
        return res.status(403).json({
          code: "ERR4002",
          message: "Sorry, wrong password",
          type: "NotFound"
        })
      } 

      const userLogin:any = {
        id: foundUserInfo.id,
        email: foundUserInfo.email,
        userId: foundUserInfo.userId
      };
      const token: String = signToken(userLogin);
      
      res.status(200).json({
        payload: [
          {
            userId: foundUserInfo.userId,
            tokens: {
              accessToken: token,
            },
            userInfo: {
              personalInfo: {
                name: foundUserInfo.name,
                email: foundUserInfo.email,
                phoneNo: foundUserInfo.phoneNo,
              },
            },
          },
        ],
        errors: [],
        success: true,
      });
    } catch (error: any) {
      logger.error(error)
      res.status(403).json({
        code: "ERR4005",
        message: "Cannot find any employee",
        type: "Forbidden"
      })
      next(error)
    }
  }

  static async registerService(req: Request, res: Response, next: NextFunction) {
    try {
      const {national_id, name, email, phoneNo, password } = req.body;
      let userId = randomNumber();
      
      const user = await pool.query(`INSERT INTO employees (national_id, name, email, "phoneNo", password, "userId") VALUES ($1, $2, $3, $4, $5, $6);`, [`${national_id}`, `${name}`, `${email}`, `${phoneNo}`, `${password}`, `${userId}`])

      logger.info("Created User", user)
      
      res.status(200).send({
        payload: [{}],
        errors: [],
        success: true,
        userId
      })
    } catch (error: any) {
      logger.error(error)
      res.status(500).json({
        code: "ERR5000",
        message: "Cannot add employees",
        type: "Internal Server Error"
      })
      next(error)
    }
  }

  static async getAllEmployees(req: Request, res: Response, next: NextFunction) {
    try {
      const employee = await pool.query('SELECT * FROM employees ORDER BY name ASC')

      logger.info("these are the employees", employee.rows)

      res.status(200).json({
        payload: [
          {
            employees: employee.rows
          }
        ],
        success: true,
        message: 'Getting all the employees',
      })
    } catch (error: any) {
      logger.error(error)
      res.status(403).json({
        code: "ERR4000",
        message: "Cannot retrieve employees",
        type: "Forbidden"
      })
      next(error)
    }
  }

  static async validateEmployee(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id)
      const { email, phoneNo, national_id } = req.body
      const employee = await pool.query('SELECT * FROM employees WHERE id = $1', [id])

      if (!id && (!(email && phoneNo && national_id ))) {
        logger.info('you must insert all required fields')
        return res.status(400).json({
          payload: [{}],
          error: [
            {
              code: "ERR4004",
              message: "you must insert email, phoneNo, and national_id",
              type: "NotFound",
            }
          ],
          success: false
        })
      }
      
      res.status(200).json({
        payload: [
          {
            employee: employee.rows[0]
          }
        ],
        success: true,
        message: `Employee ${id} Validated`,
        version: '1.0.0'
      })
    } catch (error: any) {
      logger.error(error)
      res.status(500).json({
        code: "ERR5000",
        message: "Can not validate this employee",
        type: "Internal Server Error"
      })
      next(error)
    }
    
  }

  static async updateEmployee(req: Request, res: Response, next: NextFunction) {    
    try {
      const id = parseInt(req.params.id)
      const { name, phoneNo, password, userId } = req.body;

      const findUser = await query(`SELECT * FROM employees WHERE id=${id}`);

      if (findUser.rowCount === 0) {
        res.status(404).json({
          payload: [
            {
              "Message": "Employee Not Found"
            }
          ],
          errors: [],
          success: false
        })
      } else { 
        if (name && phoneNo && password) {
          const updateUser = await pool.query('UPDATE employees SET name = $1, "phoneNo" = $2, password = $3 WHERE "userId" = $4', [name, phoneNo, password, userId])
          const updatedUser = updateUser.rows[0]
          // const name = updatedUser
          // logger.info('this is an updated user with new name , phoneNo, and password')

          return res.status(204).json({
            payload: [{
              id,
              personalInfo: {
                name: updatedUser.name,
                phoneNo: updatedUser.phoneNo,
                password: updatedUser.password
              }
            }],
            errors: [],
            success: true
          })
        } else if (name && phoneNo) {
          const updateUser = await pool.query('UPDATE employees SET name = $1, "phoneNo" = $2 WHERE id = $3', [name, phoneNo, id])
          logger.info('this is an updated user with new name and phone number')
          const updatedUser = updateUser.rows[0]
          return res.status(204).json({
            payload: [{
              id,
              personalInfo: {
                name: updatedUser.name,
                phoneNo: updatedUser.phoneNo,
              }
            }],
            errors: [],
            success: true
          })
        }
      }
    } catch (error: any) {
      logger.error(error)
      res.status(403).json({
        code: "ERR4003",
        message: "Can not validate this employee",
        type: "Forbidden"
      })
      next(error)
    }
  }

  static async removeEmployee(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const { userId } = req.body;

      const selectedUser = await pool.query('SELECT * FROM employees WHERE id = $1 ', [id])

      let userData = selectedUser.rows[0]
      
      if (!userId) {
        res.status(403).json({
          message: "Please provide the userId to delete the Employee"
        })
      } else if (selectedUser.rowCount === 0) {
        res.status(404).json({
          payload: [{}],
          errors: [{
            message: "Employee does not exist"
          }]
        })
      } else if (userId !== userData.userId) {
        res.status(403).json({
          payload: [{}],
          errors: [
            {
              code: "ERR4009",
              message: "Data doesn't match",
              type: "Forbidden"
            }
          ],
          success: false,
        })
      } 
      if (userId === userData.userId) {
        await pool.query(`DELETE FROM employees WHERE "userId" = ${userId}`)
        res.status(201).send({
          payload: [{
            message: `Employee deleted with corresponding name: ${userData.name}`,
          }],
          errors: [{}],
          success: true,
        })
      }
    } catch (error) {
      logger.error(error)
      res.status(500).json({
        code: "ERR5000",
        message: "Can't delete employee",
        type: "Internal Server Error"
      })
      next(error)
    }
  }

}

module.exports = userController;