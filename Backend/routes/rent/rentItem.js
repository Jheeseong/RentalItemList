const express = require('express');
const router = express.Router();
const rentItemController = require('../../controller/rent/rentItem');
const authUtil = require('../../config/jwt/auth').checkToken;
const authRental = require('../../config/jwt/auth').authRental;


/**
 * 담당자 : 강재민
 * 함수 설명 : 물품 대여 API
 * 미들웨어 : 토큰검증, 대여권한
 */
router.post('/rent', authUtil, authRental, rentItemController.rentItem);

module.exports = router;
