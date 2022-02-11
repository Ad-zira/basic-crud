"use strict";
const express = require('express');
const router = express.Router();
// const authRouter = require('./authRouter')
const authController = require('../controllers/authController');
// router.use('/api', authRouter)
// const authentication = require('../middlewares/auth')
router.get('/login', authController.loginService);
router.post('/register', authController.registerService);
// router.use(authentication)
router.get('/employees', authController.getAllEmployees);
router.get('/validate/:id', authController.validateEmployee);
router.put('/employee/:id', authController.updateEmployee);
router.delete('/employee/:id', authController.removeEmployee);
module.exports = router;
