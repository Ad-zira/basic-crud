const { createLogger, transports, format } = require('winston');
import path from 'path';

const { combine, timestamp, errors, json, prettyPrint } = format;

function logger() {  
  return createLogger({
    // level: 'verbose',
    format: combine(
      timestamp(),
      errors({ stack: true }),
      json(),
    ),
    defaultMeta: {service: 'user-service'},
    transports: [
      new transports.File({
        filename: 'logging/warn.log', 
        level: 'warn', 
      }),
      new transports.File({
        filename: 'logging/error.log', 
        level: 'error', 
      }),
      new transports.File({
        filename: 'logging/misc/debug.log', 
        level: 'debug', 
      }),
  
      new transports.Console(
        { 
          // level: 'silly',
          // format: combine(
          //   format.printf(x => `[${Date()}], [${x.message}]`),
          // )
          format: combine(
            json(),
            prettyPrint()
          )
        }
      ),
    ]
  })
}

export default logger;