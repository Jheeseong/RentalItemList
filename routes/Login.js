const express = require('express');
const {User} = require("../models/User");
const router = express.Router();
const jwt = require("../config/jwt/jwt");
const loginController = require("../controller/user/login")

// 로그인 페이지
router.get('/', loginController.index);
// 로그인(인증)
router.post('/api/auth', loginController.auth);
// 로그아웃
router.get('/api/logout', loginController.logout);

module.exports = router;
