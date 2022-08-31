const jwt = require('./jwt');
const cookie = require('cookie')
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cookie = require('cookie')
app.use(cookieParser());

// 액세스 권한 인증
const authUtil = {
    checkToken: async (req, res, next) => {
        // 초기 화면 접속시
        if(req.headers.cookie === undefined)
            return res.redirect('/login');

        // 쿠키에서 토큰 값 불러오기
        let token = cookie.parse(req.headers.cookie).x_auth;

        // 토큰이 존재하지 않는 경우
        if(!token || token === undefined){
            console.log("code : Token check fail, message : TOKEN EMPTY");
            return res.redirect('/login');
        }

        // 토큰 해독
        const user = await jwt.verify(token);

        // 유효기간 만료
        if (user === TOKEN_EXPIRED) {
            req.code = "Token authorized fail"
            req.message = "TOKEN_EXPIRED"
            // return req.body.json({code : "Token authorized fail", message : "TOKEN EXPIRED"});
        }
        // 유효하지 않는 토큰
        else if (user === TOKEN_INVALID){
            req.code = "Token authorized fail"
            req.message = "TOKEN_INVALID"
            // return req.body.json({code : "Token authorized fail", message : "TOKEN INVALID"});
        }
        // 토큰에 사번이 없을경우
        else if (user.workNumber === undefined){
            req.code = "Token authorized fail"
            req.message = "workNumber is undefined"
            // return res.json({code : "Token authorized fail", message : "workNumber is undefined"});
        }
        next();
    }
}

module.exports = authUtil;