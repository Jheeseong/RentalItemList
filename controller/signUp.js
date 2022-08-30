const { User } = require('../models/User')

const signUp = {
    signUp: (req, res) => {
        res.render('signUp')
    },
    saveUser: async (req, res) => {
        const user = new User(req.body);
        user.save((err, userInfo) => {
            //MongoDB에서 오는 Method, 정보들이 User model에 저장
            //저장 할 때 err가 있다면 client에 err가 있다고 전달 -> 전달을 할 때 json 형식으로 전달
            if (err) return res.json({ success: false, err })
            // 성공했을시에는 status 200 -> json 형식으로 정보 전달
            console.log("DB 저장 완료!")
            return res.status(200)
                .redirect('/login')
        })
    },
    loginUser: async (req, res) => {
        User.findOne({email: req.body.email }, (err, user) => {
            if (!user) {
                return res.json({
                    loginSuccess: false,
                    message: "제공된 이메일에 해당하는 유저가 없습니다."
                })
            }
            //요청된 이메일이 DB에 있다면 비밀번호가 맞는 비밀번호인지 확인

            user.comparePassword(req.body.password, (err, isMatch) => {
                if (!isMatch)
                    return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."});

                res.status(200)
                    .json({loginSuccess: true, userId: user})

            })
        })
    }
}


module.exports = signUp;