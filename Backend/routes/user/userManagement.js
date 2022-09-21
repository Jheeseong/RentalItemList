const express = require('express');
const router = express.Router();
const userManagement = require('../../controller/user/usermanagement')
const authUtil = require('../../config/jwt/auth').checkToken;
const authAdmin = require('../../config/jwt/auth').authAdmin;
module.exports = router;

router.get('/', authUtil, authAdmin, userManagement.index);
router.delete('/delete/:id', authUtil, authAdmin, userManagement.deleteById);
router.post('/update/edit/:id', authUtil, authAdmin, userManagement.AuthorityEdit);
router.post('/update/rental/:id', authUtil, authAdmin, userManagement.AuthorityRental);
router.post('/update/open/:id', authUtil, authAdmin, userManagement.AuthorityOpen);
router.post('/update/admin/:id', authUtil, authAdmin, userManagement.AuthorityAdmin);
router.post('/update/password/:id', authUtil, authAdmin, userManagement.resetPassword);