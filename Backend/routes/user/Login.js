const express = require('express');
const router = express.Router();
const loginController = require("../../controller/user/login")


/**
 * 담당자 : 강재민
 * 함수 설명 : 로그인 페이지 렌더링
 */
router.get('/', loginController.index);

/**
 * 담당자 : 강재민
 * 함수 설명 : 로그인 처리 API
 */
router.post('/api/auth', loginController.auth);

/**
 * 담당자 : 강재민
 * 함수 설명 : 로그아웃 처리 API
 */
router.get('/api/logout', loginController.logout);

module.exports = router;
