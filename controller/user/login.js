const { User } = require('../../models/User')
const jwt = require("../../config/jwt/jwt");

const login = {
    index: async (req, res) => {
        res.render('login');
    },
    auth: async (req, res) => {
        User.findOne({workNumber : req.body.workNumber}, async(err, result) =>
        {
            if (!result) {
                return res.json({
                    loginSuccess: false,
                    message: "로그인정보없음"
                });
            }
            result.comparePassword(req.body.password, async (err, isMatch) => {
                if (!isMatch)
                    return res.json({loginSuccess: false, message: "비밀번호가 틀렸습니다."});

                const jwtToken = await jwt.sign(result);
                // res.json({loginSuccess: true, user: result.name, Token: jwtToken});

                res.cookie("x_auth", jwtToken.token)
                    .status(200)
                    .redirect('/');
            })
        });
    },
    logout: async (req, res) => {
        res.clearCookie('x_auth')
            .redirect('/login');
    }
}

module.exports = login;