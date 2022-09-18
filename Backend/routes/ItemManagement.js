const express = require('express');
const router = express.Router();
const itemManagementController = require('../controller/ItemManagement');
const categoryController = require('../controller/category');
const itemEditController = require('../controller/editItem');
const authUtil = require('../config/jwt/auth').checkToken;
const authAdmin = require('../config/jwt/auth').authAdmin;
const authRental = require('../config/jwt/auth').authRental;
const authEdit = require('../config/jwt/auth').authEdit;
const authOpen = require('../config/jwt/auth').authOpen;



// 물품관리페이지 렌더
router.get('/', authUtil, itemManagementController.index);

// 전체 물품 검색
router.get('/findAll', authUtil, itemManagementController.findAll);

// 물품명으로 검색
router.get('/find/item/:parentCategory/:childCategory/:keyword', authUtil, itemManagementController.findByItem);

// 대여자명으로 검색
router.get('/find/lender/:parentCategory/:childCategory/:keyword', authUtil, authEdit ,itemManagementController.findByLender);

// 대분류로 소분류 리스트 불러오기
router.get('/find/childcategory/:keyword', authUtil, categoryController.findChildCategoryByParent);

// 대분류로 물품목록 검색
router.get('/find/item/parentCategory/:keyword', authUtil, itemManagementController.findByParentCategory);

// 소분류로 물품목록 검색
router.get('/find/item/childCategory/:keyword', authUtil, itemManagementController.findByChildCategory);


router.get('/edit/:id', authUtil, authEdit, itemEditController.index);

router.post('/update/:id', authUtil, authEdit, itemEditController.updateItem);

router.delete('/delete/:id', authUtil, authEdit, itemManagementController.deleteById);

router.get('/history/:itemId', authUtil, authOpen, itemManagementController.rentHistory);

module.exports = router;
