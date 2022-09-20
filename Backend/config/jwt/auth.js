const jwt = require('./jwt');
const cookie = require('cookie')
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
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
            return res.clearCookie('x_auth')
                .writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'})
                .write("<script>window.alert('토큰 유효기간이 만료되었습니다.')</script>"
                    + "<script>location.replace('/login')</script>");

            // return req.body.json({code : "Token authorized fail", message : "TOKEN EXPIRED"});
        }
        // 유효하지 않는 토큰
        else if (user === TOKEN_INVALID){
            req.code = "Token authorized fail"
            req.message = "TOKEN_INVALID"
            return res.clearCookie('x_auth')
                .writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'})
                .write("<script>window.alert('유효하지않은 토큰입니다.')</script>"
                    + "<script>location.replace('/login')</script>")

            // return req.body.json({code : "Token authorized fail", message : "TOKEN INVALID"});
        }
        // 토큰에 사번이 없을경우
        else if (user.workNumber === undefined){
            req.code = "Token authorized fail"
            req.message = "workNumber is undefined"
            return res.clearCookie('x_auth')
                .writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'})
                .write("<script>window.alert('유호하지 않은 토큰입니다.')</script>"
                    + "<script>location.replace('/login')</script>")
            // return res.json({code : "Token authorized fail", message : "workNumber is undefined"});
        }
        req.workNumber = user.workNumber;
        req.name = user.name;
        req.authority = user.authority;
        next();
    },
    authAdmin: (req, res, next) => {
        if(req.authority.administrator){
            next();

        }else {
            return res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'})
                .write("<script>window.alert('접근권한이 없습니다.')</script>"
                + "<script>location.replace('/error')</script>")
        }
    },
    authRental: (req, res, next) => {
        if(req.authority.rentalAuthority === true || req.authority.administrator === true){
            next();
        }else {
            return res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'})
                .write("<script>window.alert('접근권한이 없습니다.')</script>"
                + "<script>location.replace('/error')</script>")
        }
    },
    authEdit: (req, res, next) => {
        if(req.authority.editAuthority === true || req.authority.administrator === true){
            next();
        }else {
            return res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'})
                .write("<script>window.alert('접근권한이 없습니다.')</script>"
                + "<script>location.replace('/error')</script>")

        }

    },
    authOpen: (req, res, next) => {
        if(req.authority.openAuthority === true || req.authority.administrator === true){
            next();
        }else {
            return res.write("<script>window.alert('접근권한이 없습니다.')</script>"
                + "<script>location.replace('/error')</script>")

        }
    }



}

module.exports = authUtil;