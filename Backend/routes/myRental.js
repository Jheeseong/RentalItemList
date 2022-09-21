const express = require('express');
const router = express.Router();
const authUtil = require('../config/jwt/auth').checkToken;
const myRentalController = require('../controller/myRental');
const authAdmin = require('../config/jwt/auth').authAdmin;
const authRental = require('../config/jwt/auth').authRental;
const authEdit = require('../config/jwt/auth').authEdit;
const authOpen = require('../config/jwt/auth').authOpen;

/* GET home page. */
router.get('/', authUtil, myRentalController.index);

router.get('/returnItem/:rentId/:itemId', authUtil, authRental, myRentalController.returnItem);

router.post('/update/:keyword', authUtil, myRentalController.updateUser);

router.post('/update/password/:keyword', authUtil, myRentalController.updatePassword)
module.exports = router;
