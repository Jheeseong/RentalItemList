const express = require('express');
const router = express.Router();
const createItemController = require('../../controller/item/createItem');
const createCategoryController = require('../../controller/item/category');
const authEdit = require('../../config/jwt/auth').authEdit;
const authUtil = require('../../config/jwt/auth').checkToken;

//POST 물품 등록
router.post('/api/createItem',authUtil, authEdit, createItemController.saveItem);

router.post('/api/createCategory/:keyword',authUtil, authEdit, createCategoryController.saveCategory);

router.get('/api/find/prentCategory',authUtil, authEdit, createCategoryController.findParentCategory);

router.get('/api/find/childcategory/:keyword',authUtil, authEdit, createCategoryController.findChildCategoryByParent);

module.exports = router;
