const express = require('express');
const router = express.Router();
const rentItemController = require('../../controller/rent/rentItem');
const authUtil = require('../../config/jwt/auth').checkToken;
const authRental = require('../../config/jwt/auth').authRental;


/* GET home page. */
router.post('/rent', authUtil, authRental, rentItemController.rentItem);

module.exports = router;
