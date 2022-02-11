"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const cors = require('cors');
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const morgan = require('morgan');
const router = require('./routes');
const logger = require('./logs');
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(morgan('combined', { stream: logger.stream }));
app.use('/', router);
app.listen(port, () => {
    console.log(`This Authentication Service is listening on Port ${port}`);
});
