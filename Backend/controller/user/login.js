const { User } = require('../../models/User')
const jwt = require("../../config/jwt/jwt");
const express = require('express');
const app = express();
const cookie = require('cookie')
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const login = {
    /**
     * 담당자 : 강재민
     * 함수 설명 : 로그인 페이지 렌더링
     * 기능 설명 : - 로그인 view와 연결
     */
    index: (req, res) => {
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
    auth: (req, res) => {
        /* 아이디 정보 확인 */
        User.findOne({workNumber : req.body.workNumber}, (err, result) =>
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
    logout: (req, res) => {
        res.clearCookie('x_auth')
            .writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'})
            .write("<script>window.alert('성공적으로 로그아웃되었습니다.')</script>"
            + "<script>location.replace('/login')</script>")

    },
    /**
     * 담당자 : 강재민
     * 함수 설명 : 비밀번호 초기화 페이지 렌더
     * 기능 설명 : - 비밀번호 초기화 페이지를 렌더링합니다.
     *              - 로그아웃 알람 표시 및 로그인 페이지로 이동
     */
    forgotPassword: (req, res) => {
        res.render('./user/forgotPassword');
    },
    /**
     * 담당자 : 강재민
     * 함수 설명 : 비밀번호 초기화
     * 기능 설명 : - 비밀번호 초기화를 위해 사번, 이름, 이메일을 사용자로부터 입력받아 대조합니다.
     *              - 모든 데이터가 일치하면 비밀번호를 0405로 초기화 하도록 하였습니다.
     */
    passwordReset: async (req, res) => {
        console.log("password Reset");
        User.findOne({$and: [{workNumber: req.body.workNumber}, {email: req.body.email}, {name : req.body.name}] }, (err, result) => {
            console.log("findOne" + result);
            if (err) {
                console.log(err);
                return res.json({resetSuccess: false});
            }

            if (result._id) {
                User.updateOne({_id : result._id}, {$set: {password: "0405"}}, (err, result) => {
                    console.log("UpdateOne" + result)
                    if(err){
                        console.log(err);
                        return res.json({resetSuccess : false});
                    }
                    return res.json({resetSuccess: true, message: "비밀번호가 정상적으로 초기화되었습니다."});
                });
            }

        });
    }

}

module.exports = login;