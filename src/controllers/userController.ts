import { Request, Response, NextFunction } from "express";
import winston, {createLogger, format, loggers} from "winston";
const { json, combine, prettyPrint, errors, printf, colorize } = format;

// const logger = require('../logger')
const {comparePassword} = require('../helpers/comparePassword')
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
  level: 'info',
  transports: [
    // new winston.transports.Console(),
    new winston.transports.File({ 
      filename: 'logging/controller.log' ,
      format: combine(
        // colorize(),
        json(), 
        prettyPrint(), 
        errors({stack: true}),
        logFormat
      ),
    })
]
})

class userController {
  static async loginService(req: Request, res: Response, next: NextFunction) {
    try {
      const {email, password} = req.body;

      const foundUser = await pool.query('SELECT * FROM employees WHERE email = $1', [`${email}`])
      
      if (!foundUser) {
        logger.error('Email not registered')
      }

      const foundUserInfo = foundUser.rows[0]

      if (!comparePassword(password, foundUserInfo.password)) {
        logger.error("Wrong password")
        throw { name: "WrongPassword" };
      }

      const userLogin:any = {
        id: foundUser.id,
        email: foundUser.email,
        userId: foundUser.userId
      };

      const token = signToken(userLogin);

      res.status(200).json({
        payload: [
          {
            userId: foundUser.userId,
            tokens: {
              accessToken: token,
            },
            userInfo: {
              personalInfo: {
                email: foundUser.email,
                phoneNo: foundUser.phoneNo,
                name: foundUser.name,
              },
            },
          },
        ],
        errors: [],
        success: true,
      });

      // const userjwt = verifyToken(email)

      // res.status(200).json({
      //   success: true,
      //   message: 'The token of your user credential is ...',
      //   userjwt,
      //   version: '1.0.0'
      // })
    } catch (error) {
      logger.error(error)
    }
  }

  static async registerService(req: Request, res: Response, next: NextFunction) {
    try {
      const {national_id, name, email, phoneNo, password } = req.body;
      let userId = randomNumber();
      
      const user = await pool.query(`INSERT INTO employees (national_id, name, email, "phoneNo", password) VALUES ($1, $2, $3, $4, $5);`, [`${national_id}`, `${name}`, `${email}`, `${phoneNo}`, `${password}`])

      logger.info("Created User", user)

      res.status(200).send({
        payload: [{}],
        errors: [],
        success: true,
        userId
      })
    } catch (error) {
      logger.error(error)
      next(error)
    }
  }

  static async getAllEmployees(req: Request, res: Response, next: NextFunction) {
    try {
      const employee = await pool.query('SELECT * FROM employees ORDER BY id ASC')

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
    } catch (error) {
      logger.error(error)
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
              type: "NotFound",
              message: "you must insert email, phoneNo, and national_id"
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
    } catch (error) {
      logger.error(error)
      next(error)
    }
    
  }

  static async updateEmployee(req: Request, res: Response, next: NextFunction) {    
    try {
      const id = parseInt(req.params.id)
      const { name, phoneNo, password } = req.body;

      if (name && phoneNo && password) {
        const updateUser = await pool.query('UPDATE employees SET name = $1, "phoneNo" = $2, password = $3 WHERE id = $4', [name, phoneNo, password, id])
        const updatedUser = updateUser.rows[0]
        console.log("This is updated User", updatedUser)
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

    } catch (error) {
      logger.error(error)
      next(error)
    }
  }

  static async removeEmployee(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);

      await pool.query('DELETE FROM employees WHERE id = $1', [id], (error:any, results:any) => {
        if (error) {
          logger.error('Cannot delete, please try again')
        }
      })
      res.status(201).send({
        success: true,
        message: `Employee with ${id} deleted`,
      })
    } catch (error) {
      logger.error(error)
      next(error)
    }
  }

}

module.exports = userController;

// function password(password: any, secretKey: any) {
//   throw new Error("Function not implemented.");
// }


// function secretKey(password: any, secretKey: any) {
//   throw new Error("Function not implemented.");
// }
