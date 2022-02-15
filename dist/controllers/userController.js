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
const { simple, combine, json, prettyPrint, errors, printf, colorize } = winston_1.format;
// const logger = require('../logger')
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
    level: 'debug',
    transports: [
        new winston_1.default.transports.File({
            filename: 'logging/controller.log',
            format: combine(
            // colorize(),
            json(), prettyPrint(), errors({ stack: true }), logFormat),
        }),
        new winston_1.default.transports.Console({
            format: combine(colorize(), simple(), logFormat)
        })
    ],
    exceptionHandlers: [
        new winston_1.default.transports.File({
            filename: 'logging/exceptions.log',
            level: 'http',
            format: logFormat
        }),
        new winston_1.default.transports.Console({
            format: combine(colorize(), simple(), errors({ stack: true }), logFormat)
        })
    ]
});
class userController {
    static loginService(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const foundUser = yield pool.query('SELECT * FROM employees WHERE email = $1', [`${email}`]);
                const foundUserInfo = foundUser.rows[0];
                if (!foundUserInfo) {
                    logger.warn('Email not registered');
                    return res.status(404).json({
                        code: "ERR4001",
                        message: "Email not registered",
                        type: "Not found"
                    });
                }
                if (!password || password !== foundUserInfo.password) {
                    logger.info("Wrong password");
                    return res.status(403).json({
                        code: "ERR4002",
                        message: "Sorry, wrong password",
                        type: "NotFound"
                    });
                }
                const userLogin = {
                    id: foundUserInfo.id,
                    email: foundUserInfo.email,
                    userId: foundUserInfo.userId
                };
                const token = signToken(userLogin);
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
            }
            catch (error) {
                logger.error(error);
                res.status(403).json({
                    code: "ERR4005",
                    message: "Cannot find any employee",
                    type: "Forbidden"
                });
                next(error);
            }
        });
    }
    static registerService(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { national_id, name, email, phoneNo, password } = req.body;
                let userId = randomNumber();
                const user = yield pool.query(`INSERT INTO employees (national_id, name, email, "phoneNo", password, "userId") VALUES ($1, $2, $3, $4, $5, $6);`, [`${national_id}`, `${name}`, `${email}`, `${phoneNo}`, `${password}`, `${userId}`]);
                logger.info("Created User", user);
                res.status(200).send({
                    payload: [{}],
                    errors: [],
                    success: true,
                    userId
                });
            }
            catch (error) {
                logger.error(error);
                res.status(500).json({
                    code: "ERR5000",
                    message: "Cannot add employees",
                    type: "Internal Server Error"
                });
                next(error);
            }
        });
    }
    static getAllEmployees(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const employee = yield pool.query('SELECT * FROM employees ORDER BY name ASC');
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
                res.status(403).json({
                    code: "ERR4000",
                    message: "Cannot retrieve employees",
                    type: "Forbidden"
                });
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
                                code: "ERR4004",
                                message: "you must insert email, phoneNo, and national_id",
                                type: "NotFound",
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
                res.status(500).json({
                    code: "ERR5000",
                    message: "Can not validate this employee",
                    type: "Internal Server Error"
                });
                next(error);
            }
        });
    }
    static updateEmployee(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const { name, phoneNo, password, userId } = req.body;
                const findUser = yield query(`SELECT * FROM employees WHERE id=${id}`);
                if (findUser.rowCount === 0) {
                    res.status(404).json({
                        payload: [
                            {
                                "Message": "Employee Not Found"
                            }
                        ],
                        errors: [],
                        success: false
                    });
                }
                else {
                    if (name && phoneNo && password) {
                        const updateUser = yield pool.query('UPDATE employees SET name = $1, "phoneNo" = $2, password = $3 WHERE "userId" = $4', [name, phoneNo, password, userId]);
                        const updatedUser = updateUser.rows[0];
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
            }
            catch (error) {
                logger.error(error);
                res.status(403).json({
                    code: "ERR4003",
                    message: "Can not validate this employee",
                    type: "Forbidden"
                });
                next(error);
            }
        });
    }
    static removeEmployee(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const { userId } = req.body;
                const selectedUser = yield pool.query('SELECT * FROM employees WHERE id = $1 ', [id]);
                let userData = selectedUser.rows[0];
                if (!userId) {
                    res.status(403).json({
                        message: "Please provide the userId to delete the Employee"
                    });
                }
                else if (selectedUser.rowCount === 0) {
                    res.status(404).json({
                        payload: [{}],
                        errors: [{
                                message: "Employee does not exist"
                            }]
                    });
                }
                else if (userId !== userData.userId) {
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
                    });
                }
                if (userId === userData.userId) {
                    yield pool.query(`DELETE FROM employees WHERE "userId" = ${userId}`);
                    res.status(201).send({
                        payload: [{
                                message: `Employee deleted with corresponding name: ${userData.name}`,
                            }],
                        errors: [{}],
                        success: true,
                    });
                }
            }
            catch (error) {
                logger.error(error);
                res.status(500).json({
                    code: "ERR5000",
                    message: "Can't delete employee",
                    type: "Internal Server Error"
                });
                next(error);
            }
        });
    }
}
module.exports = userController;
