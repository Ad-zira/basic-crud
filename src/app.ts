if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const cors = require('cors');
import express from 'express';
const app = express();
const morgan = require('morgan');

const router = require('./routes')
const logger = require('./logs')

const port = process.env.PORT || 3000;

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.use(morgan('combined', { stream: logger.stream }))
app.use('/', router)

app.listen(port, () => {
  console.log(`This Authentication Service is listening on Port ${port}`)
})
