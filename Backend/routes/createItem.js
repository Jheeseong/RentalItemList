const express = require('express');
const router = express.Router();
const createItemController = require('../controller/createItem');
const createCategoryController = require('../controller/category');
const itemManagementController = require("../controller/ItemManagement");
const authAdmin = require('../config/jwt/auth').authAdmin;
const authRental = require('../config/jwt/auth').authRental;
const authEdit = require('../config/jwt/auth').authEdit;
const authOpen = require('../config/jwt/auth').authOpen;
const authUtil = require('../config/jwt/auth').checkToken;

//POST 물품 등록
router.post('/api/createItem',authUtil, authEdit, createItemController.saveItem);

router.post('/api/createCategory/:keyword',authUtil, authEdit, createCategoryController.saveCategory);

router.get('/api/find/prentCategory',authUtil, authEdit, createCategoryController.findParentCategory);

router.get('/api/find/childcategory/:keyword',authUtil, authEdit, createCategoryController.findChildCategoryByParent);

module.exports = router;
