const { User } = require('../../models/User')

const signUp = {
    signUp: (req, res) => {
        res.render('./user/signUp')
    },
    saveUser: (req, res) => {
        const user = new User(req.body);
        User.findOne({workNumber: req.body.workNumber}, (err, findUser) => {
            if (findUser === null) {
                user.save((err,userinfo) => {
                    //MongoDB에서 오는 Method, 정보들이 User model에 저장
                    //저장 할 때 err가 있다면 client에 err가 있다고 전달 -> 전달을 할 때 json 형식으로 전달
                    if (err) {
                        return res.status(400)
                            .json({ success: false, err,
                            message: "회원가입정보를 다시 한 번 확인해주세요."})
                    }
                    // 성공했을시에는 status 200
                    return res.json({signup: true, message: "회원가입이 되였습니다."})
                });
            } else {
                res.json({signup: false, message: "사번이 이미 등록되어 있습니다."})
            }
        })

    },
    findUser: (req, res) => {
        User.findOne({workNumber: req.workNumber}, (err, result) => {
            if (result != null) {
                res.json({message: "이미 존재하는 사번입니다."})
            }
        })
    }
    // loginUser: async (req, res) => {
    //     User.findOne({workNumber: req.body.workNumber }, (err, user) => {
    //         if (!user) {
    //             return res.json({
    //                 loginSuccess: false,
    //                 message: "제공된 이메일에 해당하는 유저가 없습니다."
    //             })
    //         }
    //         //요청된 이메일이 DB에 있다면 비밀번호가 맞는 비밀번호인지 확인
    //
    //         user.comparePassword(req.body.password, (err, isMatch) => {
    //             if (!isMatch)
    //                 return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."});
    //
    //             res.status(200)
    //                 .json({loginSuccess: true, userId: user})
    //
    //         })
    //     })
    // }
}


module.exports = signUp;