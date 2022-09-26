const express = require('express');
const router = express.Router();
const loginController = require("../../controller/user/login");
/**
 * 담당자 : 강재민
 * 함수 설명 : 비밀번호 초기화 페이지 렌더링
 */
router.get('/', loginController.forgotPassword)

/**
 * 담당자 : 강재민
 * 함수 설명 : 비밀번호 초기화 API
 */
router.post('/passwordReset', loginController.passwordReset)

module.exports = router;