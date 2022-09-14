const express = require('express');
const router = express.Router();
const userManagement = require('../controller/user/usermanagement')
const authUtil = require('../config/jwt/auth').checkToken;
module.exports = router;

router.get('/', authUtil, userManagement.index);
router.delete('/delete/:id', authUtil, userManagement.deleteById);
router.post('/update/edit/:id', authUtil, userManagement.AuthorityEdit);
router.post('/update/rental/:id', authUtil, userManagement.AuthorityRental);
router.post('/update/open/:id', authUtil, userManagement.AuthorityOpen);
router.post('/update/password/:id', authUtil, userManagement.resetPassword)