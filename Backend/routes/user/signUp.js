const express = require('express');
const router = express.Router();
const signUpController = require('../../controller/user/signUp')

router.get("/",signUpController.signUp);

router.post("/api/signUp",signUpController.saveUser)

module.exports = router;