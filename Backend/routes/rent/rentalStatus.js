const express = require('express');
const router = express.Router();
const rentalStatusController = require('../../controller/rent/rentalStatus');
const authUtil = require('../../config/jwt/auth').checkToken;
const authOpen = require('../../config/jwt/auth').authOpen;
/**
 * 담당자 : 정희성
 * 함수 내용 : 대여현황 페이지 렌더링
 * 미들 웨어 : 토큰 검증, 열람 권한 검증
 **/
router.get('/', authUtil, authOpen, rentalStatusController.index);


module.exports = router;