"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const morgan = require("morgan");
const logger = require("../logger");
// const stream: StreamOptions = {
//   write: (message) => logger.http(message)
// }
const skip = () => {
    const env = process.env.NODE_ENV || "development";
    return env !== "development";
};
const morganMiddleware = morgan(':method :url :status :res[content-length] - :response-time ms', {
    // stream,
    skip
});
module.exports = morganMiddleware;
