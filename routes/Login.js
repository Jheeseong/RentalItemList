const express = require('express');
const {User} = require("../models/User");
const router = express.Router();
const jwt = require("../config/jwt/jwt");

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('Login');
});

router.post("/api/login", (req, res) => {
    User.findOne({email:req.body.email}, async (err, result) => {
        if (!result) {
            return res.json({
                loginSuccess: false,
                message: "로그인정보없음"
            });
        } else {
            const jwtToken = await jwt.sign(result);
            res.json({loginSuccess: true, user: result.name, Token: jwtToken});
        }

    });



})

module.exports = router;
