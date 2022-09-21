const express = require('express');
const router = express.Router();
const authUtil = require('../../config/jwt/auth').checkToken;
const myRentalController = require('../../controller/rent/myRental');
const authRental = require('../../config/jwt/auth').authRental;

/* GET home page. */
router.get('/', authUtil, myRentalController.index);

router.get('/returnItem/:rentId/:itemId', authUtil, authRental, myRentalController.returnItem);

router.post('/update/:keyword', authUtil, myRentalController.updateUser);

router.post('/update/password/:keyword', authUtil, myRentalController.updatePassword)
module.exports = router;
