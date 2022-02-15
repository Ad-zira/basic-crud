const express = require('express')
const router = express.Router();
const userController = require('../controllers/userController')

// router.use('/api', authRouter)
// const authorization = require('../middlewares/auth')

router.post('/login', userController.loginService)
router.post('/register', userController.registerService)

// router.use(authorization)

router.get('/employees', userController.getAllEmployees)
router.get('/validate/:id', userController.validateEmployee)
router.put('/employee/:id', userController.updateEmployee)
router.delete('/employee/:id', userController.removeEmployee)

module.exports = router