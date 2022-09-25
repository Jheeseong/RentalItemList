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
    /**
     * 담당자 : 강재민
     * 함수 설명 : 토큰 검증 미들웨어
     * 기능 설명 : - 쿠키에 있는 토큰을 검증하여 그결과를 return하는 함수입니다.
     *              - 토큰이 존재하지 않는 경우에는 login 페이지로 redirect합니다.
     *              - 토큰의 유효기간이 만료되었거나, 유효하지 않은 경우에는 요류메시지를 표시하고 login 페이지로 redirect 합니다.
     *              - 토큰 검증이 통과되면 request에 사번, 이름, 권한을 실어 다음 함수로 전송합니다.
     */
    checkToken: async (req, res, next) =>{
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
    /**
     * 담당자 : 강재민
     * 함수 설명 : 관리자 권한 검증 미들웨어
     * 기능 설명 : - 관리자만이 접근할 수 있는 API 혹은 페이지를 사용할때 걸어주는 미들웨어입니다.
     *              - 위의 토큰 검증 미들웨어에서 받아온 request를 통해 관리자인지 판단합니다.
     *              - 관리자의 권한이 없으면 에러메시지를 표시하고 error 페이지를 return 렌더합니다.
     */
    authAdmin: (req, res, next) => {
        if(req.authority.administrator){
            next();

        }else {
            return res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'})
                .write("<script>window.alert('접근권한이 없습니다.')</script>"
                + "<script>location.replace('/error')</script>")
        }
    },
    /**
     * 담당자 : 강재민
     * 함수 설명 : 대여 권한 검증 미들웨어
     * 기능 설명 : - 대여권한을 가진 사용자이 접근할 수 있는 API 혹은 페이지를 사용할때 걸어주는 미들웨어입니다.
     *              - 위의 토큰 검증 미들웨어에서 받아온 request를 통해 관리자인지 판단합니다.
     *              - 대여권한 혹은 관리자권한이 없으면 에러메시지를 표시하고 error 페이지를 return 렌더합니다.
     */
    authRental: (req, res, next) => {
        if(req.authority.rentalAuthority === true || req.authority.administrator === true){
            next();
        }else {
            return res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'})
                .write("<script>window.alert('접근권한이 없습니다.')</script>"
                + "<script>location.replace('/error')</script>")
        }
    },
    /**
     * 담당자 : 강재민
     * 함수 설명 : 편집 권한 검증 미들웨어
     * 기능 설명 : - 편집권한을 가진 사용자만이 접근할 수 있는 API 혹은 페이지를 사용할때 걸어주는 미들웨어입니다.
     *              - 위의 토큰 검증 미들웨어에서 받아온 request를 통해 관리자인지 판단합니다.
     *              - 편집권한 혹은 관리자권한이 없으면 에러메시지를 표시하고 error 페이지를 return 렌더합니다.
     */
    authEdit: (req, res, next) => {
        if(req.authority.editAuthority === true || req.authority.administrator === true){
            next();
        }else {
            return res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'})
                .write("<script>window.alert('접근권한이 없습니다.')</script>"
                + "<script>location.replace('/error')</script>")
        }
    },
    /**
     * 담당자 : 강재민
     * 함수 설명 : 열람 권한 검증 미들웨어
     * 기능 설명 : - 열람권한을 가진 사용자만이 접근할 수 있는 API 혹은 페이지를 사용할때 걸어주는 미들웨어입니다.
     *              - 위의 토큰 검증 미들웨어에서 받아온 request를 통해 관리자인지 판단합니다.
     *              - 열람권한 혹은 관리자권한이 없으면 에러메시지를 표시하고 error 페이지를 return 렌더합니다.
     */
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