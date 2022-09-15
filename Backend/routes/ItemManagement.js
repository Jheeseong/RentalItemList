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


/* GET home page. */
router.get('/', authUtil, authEdit, itemManagementController.index);

router.get('/findAll', authUtil ,itemManagementController.findAll);

router.get('/find/item/:parentCategory/:childCategory/:keyword', authUtil, itemManagementController.findByItem);

router.get('/find/lender/:parentCategory/:childCategory/:keyword', authUtil, itemManagementController.findByLender);

router.get('/find/childcategory/:keyword', authUtil, categoryController.findChildCategoryByParent);

router.get('/find/item/parentCategory/:keyword', authUtil, itemManagementController.findByParentCategory);

router.get('/find/item/childCategory/:keyword', authUtil, itemManagementController.findByChildCategory);

router.get('/edit/:id', authUtil, itemEditController.index);

router.post('/update/:id', authUtil, itemEditController.updateItem);

router.delete('/delete/:id', authUtil, itemManagementController.deleteById);

module.exports = router;
