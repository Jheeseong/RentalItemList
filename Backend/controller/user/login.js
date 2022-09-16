const { User } = require('../../models/User')
const jwt = require("../../config/jwt/jwt");
const express = require('express');
const app = express();
const cookie = require('cookie')
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const login = {
    /* 로그인 페이지 랜더링*/
    index: async (req, res) => {
        // if(req.headers.cookie){
        //     if(cookie.parse(req.headers.cookie).x_auth){
        //         console.log("로그인 정보 있음, 메인페이지로 이동");
        //         res.redirect('/');
        //     }
        // }
        // else{
        //     res.render('login');
        // }
        res.render('./user/login');

    },
    /* 로그인(인증) */
    auth: async (req, res) => {
        /* 아이디 정보 확인 */
        User.findOne({workNumber : req.body.workNumber}, async(err, result) =>
        {
            /* 아이디 정보가 없을 때 */
            if (!result) {
                return res.json({
                    loginSuccess: false,
                    message: "존재하지 않는 아이디입니다."
                });
            }
            /* 아이디 정보가 있을 경우 비밀번호 대조 */
            result.comparePassword(req.body.password, async (err, isMatch) => {
                if (!isMatch)
                    return res.json({loginSuccess: false, message: "비밀번호가 틀렸습니다."});

                /* 비밀번호가 일치할 경우 액세스 토큰 발급 */
                const jwtToken = await jwt.sign(result);
                // res.json({loginSuccess: true, user: result.name, Token: jwtToken});
                /* 쿠키에 토큰 저장 */
                return res.cookie("x_auth", jwtToken.token)
                    .json({loginSuccess: true, message: result.name + "님 환영합니다."})


            });
        });
    },
    /* 로그아웃 */
    logout: async (req, res) => {
        res.clearCookie('x_auth')
            .write("<script>window.alert('Logout Success!')</script>"
            + "<script>location.replace('/login')</script>")

    }
}

module.exports = login;