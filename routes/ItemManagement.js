const express = require('express');
const router = express.Router();
const itemManagementController = require('../controller/ItemManagement')
const authUtil = require('../config/jwt/auth').checkToken;

/* GET home page. */
router.get('/', authUtil, itemManagementController.index);

// 토큰 인증 테스트
router.post('/authutil', authUtil);

module.exports = router;
