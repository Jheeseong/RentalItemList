const express = require('express');
const router = express.Router();
const authUtil = require('../config/jwt/auth').checkToken;
const myRentalController = require('../controller/myRental');

/* GET home page. */
router.get('/', authUtil, myRentalController.index);

module.exports = router;
