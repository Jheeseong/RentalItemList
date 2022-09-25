const { User } = require('../../models/User')
const jwt = require("../../config/jwt/jwt");
const express = require('express');
const app = express();
const cookie = require('cookie')
const cookieParser = require('cookie-parser');
app.use(cookieParser());
/**
 * 담당자 : 강재민
 * 파일 설명 : 로그인페이지의 Service기능을 담당하는 JavaScript 파일 입니다.
 */

const login = {
    /**
     * 담당자 : 강재민
     * 함수 설명 : 로그인 페이지 렌더링
     * 기능 설명 : - 로그인 view와 연결
     */
    index: async (req, res) => {
        res.render('./user/login');
    },


    /**
     * 담당자 : 강재민, 정희성
     * 함수 설명 : 로그인 검증
     * 기능 설명 : - 입력받은 사번 검색
     *              - 사번이 있을 시 입력한 비밀번호와 DB의 비밀번호 대조
     *              - 사번과 비밀번호가 모두 일치할 경우 jwt 토큰 발급 후 쿠키에 토큰 저장
     *              - frontend로 로그인 성공 여부와 성공 메시지 전송
     */
    auth: async (req, res) => {
        /* 아이디 정보 확인 */
        User.findOne({workNumber : req.body.workNumber}, async(err, result) =>
        {
            /* 아이디 정보가 없을 때 */
            if (!result) {
                return res.json({
                    loginSuccess: false,
                });
            }
            /* 아이디 정보가 있을 경우 비밀번호 대조 */
            result.comparePassword(req.body.password, async (err, isMatch) => {
                if (!isMatch)
                    return res.json({loginSuccess: false});

                /* 비밀번호가 일치할 경우 액세스 토큰 발급 */
                const jwtToken = await jwt.sign(result);
                // res.json({loginSuccess: true, user: result.name, Token: jwtToken});
                /* 쿠키에 토큰 저장 */

                return res.cookie("x_auth", jwtToken.token)
                    .json({loginSuccess: true, message: result.name + "님 환영합니다."})


            });
        });
    },
    /**
     * 담당자 : 강재민
     * 함수 설명 : 로그아웃
     * 기능 설명 : - 토큰이 저장된 쿠키를 삭제
     *              - 로그아웃 알람 표시 및 로그인 페이지로 이동
     */
    logout: async (req, res) => {
        res.clearCookie('x_auth')
            .writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'})
            .write("<script>window.alert('성공적으로 로그아웃되었습니다.')</script>"
            + "<script>location.replace('/login')</script>")

    }
}

module.exports = login;