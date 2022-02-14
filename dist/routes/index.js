"use strict";
const express = require('express');
const router = express.Router();
// const authRouter = require('./authRouter')
const userController = require('../controllers/userController');
// router.use('/api', authRouter)
// const authentication = require('../middlewares/auth')
router.post('/login', userController.loginService);
router.post('/register', userController.registerService);
// router.use(authentication)
router.get('/employees', userController.getAllEmployees);
router.get('/validate/:id', userController.validateEmployee);
router.put('/employee/:id', userController.updateEmployee);
router.delete('/employee/:id', userController.removeEmployee);
module.exports = router;
