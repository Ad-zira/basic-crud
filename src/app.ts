if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const cors = require('cors');
import express, { Request, Response } from 'express'; 
const app = express();
const morgan = require('morgan');
const winston = require('winston')

const router = require('./routes')
const logger = require('./logger')
// const morganMiddleware = require('./config/morganMiddleware')

const port = process.env.PORT || 3000;

let loggerApp = new winston.createLogger({
  exitOnError: false,
  level: 'info',
  format: winston.format.combine(
    winston.format.json(),
    winston.format.errors({stack: true}),
    winston.format.prettyPrint()
  ),
  transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({ 
        filename: 'logging/app.log',
        handleRejections: true,
        handleExceptions: true
      })
  ]
})

const myStream = {
  write: (text: string) => {
    loggerApp.info(text)
  }
}

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

// app.use(morganMiddleware)
// app.use(morgan('dev', {
//   skip: function (req:Request, res:Response) { return res.statusCode < 400 }
// }))
app.use(morgan('combined', { stream: myStream }))

app.use('/', router)

app.listen(port, () => {
  console.log(`This Authentication Service is listening on Port ${port}`)
})
