const express = require('express');
const userController = require('./userController');
const router = express.Router();

router.post('/users', userController.createUser);

router.get('/users', userController.getUsers);

router.put('/users', userController.updateUser);

module.exports = router;

