"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authRouter = express_1.default.Router();
const authController = require('../controllers/authController');
// const authentication = require('../middlewares/auth')
authRouter.post('/login', authController.loginService);
authRouter.post('/register', authController.registerService);
// authRouter.use(authentication)
authRouter.get('/employees', authController.getAllEmployees);
authRouter.get('/validate/:id', authController.validateEmployee);
authRouter.put('/employee/:id', authController.updateEmployee);
authRouter.delete('/employee/:id', authController.removeEmployee);
exports.default = authRouter;
