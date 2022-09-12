const express = require('express');
const router = express.Router();
const rentItemController = require('../controller/rentItem');
const authUtil = require('../config/jwt/auth').checkToken;

/* GET home page. */
router.post('/rent', authUtil, rentItemController.rentItem);


module.exports = router;
