const express = require('express');
const router = express.Router();
const itemManagementController = require('../controller/ItemManagement')
const authUtil = require('../config/jwt/auth').checkToken;

/* GET home page. */
router.get('/', authUtil, itemManagementController.index);

router.get('/findAll', itemManagementController.findAll);

router.get('/find/item/:keyword', itemManagementController.findByItem);

router.get('/find/lender/:keyword', itemManagementController.findByLender)

module.exports = router;
