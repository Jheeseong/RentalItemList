const express = require('express');
const router = express.Router();
const authUtil = require('../../config/jwt/auth').checkToken;
const myRentalController = require('../../controller/rent/myRental');
const authRental = require('../../config/jwt/auth').authRental;

/**
 * 담당자 : 강재민
 * 함수 설명 : 나의 대여 현황 페이지 렌더링
 * 미들웨어 : 토큰 검증
 */
router.get('/', authUtil, myRentalController.index);

/**
 * 담당자 : 강재민
 * 함수 설명 : 물품 반납 API(물품_id, 대여_id)
 * 미들웨어 : 토큰 검증, 대여 권한
 */
router.get('/returnItem/:rentId/:itemId', authUtil, authRental, myRentalController.returnItem);


router.post('/update/:keyword', authUtil, myRentalController.updateUser);

router.post('/update/password/:keyword', authUtil, myRentalController.updatePassword)
module.exports = router;
