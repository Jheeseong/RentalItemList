const express = require('express');
const router = express.Router();
const rentRecordController = require('../controller/rentRecord');
const authUtil = require('../config/jwt/auth').checkToken;
const authAdmin = require('../config/jwt/auth').authAdmin;
const authRental = require('../config/jwt/auth').authRental;
const authEdit = require('../config/jwt/auth').authEdit;
const authOpen = require('../config/jwt/auth').authOpen;

/* GET home page. */
router.get('/', authUtil, authOpen, rentRecordController.index);


module.exports = router;
