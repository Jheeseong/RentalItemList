const express = require('express');
const router = express.Router();
const rentRecordController = require('../../controller/rent/rentRecord');
const authUtil = require('../../config/jwt/auth').checkToken;
const authOpen = require('../../config/jwt/auth').authOpen;

/* GET home page. */
router.get('/', authUtil, authOpen, rentRecordController.index);


module.exports = router;
