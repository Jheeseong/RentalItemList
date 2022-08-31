const express = require('express');
const router = express.Router();
const indexController = require('../controller/index')
const createController = require('../controller/createItem')
const authUtil = require('../config/jwt/auth').checkToken;

/* GET home page. */
router.get('/', authUtil, indexController.index);

router.post('/api/createItem', createController.saveItem)

// 토큰 인증 테스트
router.post('/authutil', authUtil);

module.exports = router;
