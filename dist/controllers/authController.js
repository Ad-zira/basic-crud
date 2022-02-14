"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importStar(require("winston"));
const { json, combine, prettyPrint, errors, printf, colorize } = winston_1.format;
// const logger = require('../logger')
const { comparePassword } = require('../helpers/comparePassword');
const { signToken, verifyToken } = require('../helpers/jwt');
const auth = require('../middlewares/auth');
const pool = require('../db/db');
const randomNumber = require('../helpers/randomGenerate');
const { encrypt, decrypt } = require('../helpers/crypto');
const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} ${level}: ${stack || message}`;
});
let logger = (0, winston_1.createLogger)({
    exitOnError: false,
    level: 'info',
    transports: [
        // new winston.transports.Console(),
        new winston_1.default.transports.File({
            filename: 'logging/controller.log',
            format: combine(
            // colorize(),
            json(), prettyPrint(), errors({ stack: true }), logFormat),
        })
    ]
});
class authController {
    static loginService(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const foundUser = yield pool.query('SELECT * FROM employees WHERE email = $1', [`${email}`]);
                if (!foundUser) {
                    logger.error('Email not registered');
                }
                const foundUserInfo = foundUser.rows[0];
                if (!comparePassword(password, foundUserInfo.password)) {
                    logger.error("Wrong password");
                    throw { name: "WrongPassword" };
                }
                const userLogin = {
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
            }
            catch (error) {
                logger.error(error);
            }
        });
    }
    static registerService(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { national_id, name, email, phoneNo, password } = req.body;
                let userId = randomNumber();
                const user = yield pool.query(`INSERT INTO employees (national_id, name, email, "phoneNo", password) VALUES ($1, $2, $3, $4, $5);`, [`${national_id}`, `${name}`, `${email}`, `${phoneNo}`, `${password}`]);
                logger.log("Created User", user);
                res.status(200).send({
                    payload: [{}],
                    errors: [],
                    success: true,
                    userId
                });
            }
            catch (error) {
                logger.error(error);
                next(error);
            }
        });
    }
    static getAllEmployees(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const employee = yield pool.query('SELECT * FROM employees ORDER BY id ASC');
                logger.info("these are the employees", employee.rows);
                res.status(200).json({
                    payload: [
                        {
                            employees: employee.rows
                        }
                    ],
                    success: true,
                    message: 'Getting all the employees',
                });
            }
            catch (error) {
                logger.error(error);
                next(error);
            }
        });
    }
    static validateEmployee(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const { email, phoneNo, national_id } = req.body;
                const employee = yield pool.query('SELECT * FROM employees WHERE id = $1', [id]);
                if (!id && (!(email && phoneNo && national_id))) {
                    logger.info('you must insert all required fields');
                    return res.status(400).json({
                        payload: [{}],
                        error: [
                            {
                                type: "NotFound",
                                message: "you must insert email, phoneNo, and national_id"
                            }
                        ],
                        success: false
                    });
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
                });
            }
            catch (error) {
                logger.error(error);
                next(error);
            }
        });
    }
    static updateEmployee(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const { name, phoneNo, password } = req.body;
                if (name && phoneNo && password) {
                    const updateUser = yield pool.query('UPDATE employees SET name = $1, "phoneNo" = $2, password = $3 WHERE id = $4', [name, phoneNo, password, id]);
                    const updatedUser = updateUser.rows[0];
                    console.log("This is updated User", updatedUser);
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
                    });
                }
                else if (name && phoneNo) {
                    const updateUser = yield pool.query('UPDATE employees SET name = $1, "phoneNo" = $2 WHERE id = $3', [name, phoneNo, id]);
                    logger.info('this is an updated user with new name and phone number');
                    const updatedUser = updateUser.rows[0];
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
                    });
                }
            }
            catch (error) {
                logger.error(error);
                next(error);
            }
        });
    }
    static removeEmployee(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                yield pool.query('DELETE FROM employees WHERE id = $1', [id], (error, results) => {
                    if (error) {
                        logger.error('Cannot delete, please try again');
                    }
                });
                res.status(201).send({
                    success: true,
                    message: `Employee with ${id} deleted`,
                });
            }
            catch (error) {
                logger.error(error);
                next(error);
            }
        });
    }
}
module.exports = authController;
// function password(password: any, secretKey: any) {
//   throw new Error("Function not implemented.");
// }
// function secretKey(password: any, secretKey: any) {
//   throw new Error("Function not implemented.");
// }
