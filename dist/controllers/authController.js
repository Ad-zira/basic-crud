"use strict";
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
const logger = require('../logs');
// const User = require('../models/User')
class authController {
    static loginService(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.status(200).send({
                    success: true,
                    message: 'Welcome to the login service',
                    version: '1.0.0'
                });
            }
            catch (error) {
                logger.error(error);
            }
        });
    }
    static registerService(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.status(200).send({
                    success: true,
                    message: 'Welcome to the Register service',
                    version: '1.0.0'
                });
            }
            catch (error) {
                logger.error(error);
            }
        });
    }
    static getAllEmployees(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.status(200).send({
                    success: true,
                    message: 'Getting all the employees',
                });
            }
            catch (error) {
                logger.error(error);
            }
        });
    }
    static validateEmployee(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.status(200).send({
                    success: true,
                    message: 'Welcome to the Employee Validation service',
                    version: '1.0.0'
                });
            }
            catch (error) {
                logger.error(error);
            }
        });
    }
    static updateEmployee(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.status(200).send({
                    success: true,
                    message: 'Welcome to the update Employee Service',
                    version: '1.0.0'
                });
            }
            catch (error) {
                logger.error(error);
            }
        });
    }
    static removeEmployee(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.status(204).send({
                    success: true,
                    message: 'Employee deleted',
                });
            }
            catch (error) {
                logger.error(error);
            }
        });
    }
}
module.exports = authController;
