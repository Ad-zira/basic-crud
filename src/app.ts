import cors from 'cors';
import express from 'express';
const app = express();
const morgan = require('morgan');

const PORT = process.env.PORT || 3003;

const routes = require('./routes')
const logger = require('./logs')

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.use(morgan('combined', { stream: logger.stream }))
app.use('/', routes)

app.listen(PORT, () => {
  console.log(`This Authentication Service is listening on Port ${PORT}`) // must be avoided
})