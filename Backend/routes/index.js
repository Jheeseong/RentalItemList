const express = require('express');
const router = express.Router();
const indexController = require('../controller/index');
const authUtil = require('../config/jwt/auth').checkToken;

/**
 * 담당자 : 강재민
 * 함수 설명 : 메인홈페이지 렌더링
 */
router.get('/', authUtil, indexController.index);

/**
 * 담당자 : 강재민
 * 함수 설명 : 에러 페이지 렌더링
 */
router.get('/error', indexController.error);


module.exports = router;
