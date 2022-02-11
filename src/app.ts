import cors from 'cors';
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3003;

import routes from './routes'

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.use('/', routes)

app.listen(PORT, () => {
  console.log(`This Authentication Service is listening on Port ${PORT}`) // must be avoided
})