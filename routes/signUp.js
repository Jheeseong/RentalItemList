const express = require('express');
const {User} = require("../models/User");
const router = express.Router();
const jwt = require("../config/jwt/jwt");
const signUpController = require('../controller/signUp')

router.get("/",signUpController.signUp);

router.post("/api/signUp",signUpController.saveUser)

router.post("/api/signIn",signUpController.loginUser)

module.exports = router;