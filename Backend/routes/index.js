const express = require('express');
const router = express.Router();
const indexController = require('../controller/index');


const authUtil = require('../config/jwt/auth').checkToken;

/* GET home page. */
router.get('/', authUtil, indexController.index);

// 토큰 인증 테스트
router.post('/authutil', authUtil);

module.exports = router;
