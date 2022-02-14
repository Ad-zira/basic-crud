"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const { combine, timestamp, errors, json, prettyPrint, label } = winston_1.format;
function logger() {
    return (0, winston_1.createlogger)({
        // level: 'verbose',
        format: combine(timestamp(), errors({ stack: true }), json()),
        defaultMeta: { service: 'user-service' },
        transports: [
            new winston_1.transports.File({
                filename: 'logging/warn.log',
                level: 'warn',
            }),
            new winston_1.transports.File({
                filename: 'logging/error.log',
                level: 'error',
            }),
            new winston_1.transports.File({
                filename: 'logging/misc/debug.log',
                level: 'debug',
            }),
            new winston_1.transports.Console({
                format: combine(json(), prettyPrint())
            }),
        ],
        exitOnError: false,
    });
}
module.exports = logger;
