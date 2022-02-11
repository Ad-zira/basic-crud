import express from 'express'
const router = express.Router();
import authRouter from './authRouter'

router.use('/api', authRouter)

export default router