const express = require('express');
const router = express.Router();
const rentalStatusController = require('../controller/rentalStatus');
const authUtil = require('../config/jwt/auth').checkToken;

/* GET home page. */
router.get('/', authUtil, rentalStatusController.index);


module.exports = router;