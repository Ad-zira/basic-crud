import express from 'express'
const authRouter = express.Router()

const authController = require('../controllers/authController')
// const authentication = require('../middlewares/auth')

authRouter.post('/login', authController.loginService)
authRouter.post('/register', authController.registerService)

// authRouter.use(authentication)

authRouter.get('/employees', authController.getAllEmployees)
authRouter.get('/validate/:id', authController.validateEmployee)
authRouter.put('/employee/:id', authController.updateEmployee)
authRouter.delete('/employee/:id', authController.removeEmployee)

export default authRouter