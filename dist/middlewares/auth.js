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
const logger = require('../logger');
const { verifyToken } = require('../helpers/jwt');
const authorization = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { access_token: token } = req.headers;
        if (!token) {
            logger.error('InvalidInput');
        }
        const user = verifyToken(token);
        if (user.userId !== req.body.userId) {
            res.status(404).send({
                message: "User not found",
            });
        }
        next();
    }
    catch (error) {
        logger.error(error);
        next(error);
    }
});
module.exports = authorization;
