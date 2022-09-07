const express = require('express');
const router = express.Router();
const itemManagementController = require('../controller/ItemManagement');
const categoryController = require('../controller/category');
const authUtil = require('../config/jwt/auth').checkToken;

/* GET home page. */
router.get('/', authUtil, itemManagementController.index);

router.get('/findAll', itemManagementController.findAll);

router.get('/find/item/:parentCategory/:childCategory/:keyword', itemManagementController.findByItem);

router.get('/find/lender/:parentCategory/:childCategory/:keyword', itemManagementController.findByLender);

router.get('/find/childcategory/:keyword', categoryController.findChildCategoryByParent);

router.get('/find/item/parentCategory/:keyword', itemManagementController.findByParentCategory);

router.get('/find/item/childCategory/:keyword', itemManagementController.findByChildCategory);

router.delete('/delete/:id', itemManagementController.deleteById);

module.exports = router;
