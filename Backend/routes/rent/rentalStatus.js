const express = require('express');
const router = express.Router();
const rentalStatusController = require('../../controller/rent/rentalStatus');
const authUtil = require('../../config/jwt/auth').checkToken;
const authOpen = require('../../config/jwt/auth').authOpen;
/* GET home page. */
router.get('/', authUtil, authOpen, rentalStatusController.index);


module.exports = router;