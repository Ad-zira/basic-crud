"use strict";
const { createLogger, transports, format, addColors } = require('winston');
// const path = require('path');
const { combine, timestamp, http, errors, json, prettyPrint, cli, colorize } = format;
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};
// const level = () => {
//   const env = process.env.NODE_ENV || 'development'
//   const isDevelopment = env === 'development'
//   return isDevelopment ? 'debug': 'warn'
// }
function logger() {
    const customLevels = {
        levels: {
            error: 0,
            warn: 1,
            info: 2,
            http: 3,
            verbose: 4,
            debug: 5,
            silly: 6
        },
        colors: {
            error: 'red',
            warn: 'bold yellow',
            info: 'blue',
            http: 'italic cyan',
            verbose: 'dim magenta',
            debug: 'green',
            silly: 'dim white'
        }
    };
    addColors(customLevels.colors);
    return createLogger({
        level: 'debug',
        levels,
        defaultMeta: { service: 'user-service' },
        exitOnError: false,
        format: combine(colorize(), timestamp(), errors({ stack: true }), json()),
        transports: [
            new transports.File({
                filename: 'logging/all.log',
                handleExceptions: true,
                level: 'warn',
            }),
            new transports.File({
                filename: 'logging/misc/error.log',
                format: cli(),
                level: 'error',
            }),
            new transports.File({
                filename: 'logging/misc/debug.log',
                level: 'debug',
            }),
            new transports.Console({
                format: combine(json(), prettyPrint())
            }),
        ],
    });
}
module.exports = logger;
