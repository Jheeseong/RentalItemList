const { User } = require('../../models/User')
const jwt = require("../../config/jwt/jwt");

const login = {
    /* 로그인 페이지 랜더링*/
    index: async (req, res) => {
        res.render('login');
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
                    message: "로그인정보없음"
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
                res.cookie("x_auth", jwtToken.token)
                    .status(200)
                    .redirect('/');
            });
        });
    },
    /* 로그아웃 */
    logout: async (req, res) => {
        res.clearCookie('x_auth')
            .redirect('/login');
    }
}

module.exports = login;