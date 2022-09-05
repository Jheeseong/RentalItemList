const express = require('express');
const router = express.Router();
const indexController = require('../controller/index')
const createItemController = require('../controller/createItem')
const createCategoryController = require('../controller/category')
const authUtil = require('../config/jwt/auth').checkToken;

/* GET home page. */
router.get('/', authUtil, indexController.index);

//POST 물품 등록
router.post('/api/createItem', createItemController.saveItem);

router.post('/api/createCategory', createCategoryController.saveCategory);

// 토큰 인증 테스트
router.post('/authutil', authUtil);

module.exports = router;
