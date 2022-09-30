const express = require('express');
const router = express.Router();
const signUpController = require('../../controller/user/signUp')
/**
 * 담당자 : 정희성
 * 함수 내용 : 회원가입 페이지 렌더링
 **/
router.get("/",signUpController.signUp);
/**
 * 담당자 : 정희성
 * 함수 내용 : 회원가입에 작성한 회원 정보 저장하는 POST API
 **/
router.post("/api/signUp",signUpController.saveUser)

router.post("/api/certification",signUpController.emailConfiguration)

module.exports = router;