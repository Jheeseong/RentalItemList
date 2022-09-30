/**
* 담당자 : 정희성
* 파일 설명 : 유저 회원가입 기능이 작성된 자바 스크립트 파일
**/
const { User } = require('../../models/User')
const Aws = require('../../config/aws/aws')

const signUp = {
    /**
    * 담당자 : 정희성
    * 주요 기능 : 회원가입 ejs를 불러와주는 기능
    **/
    signUp: (req, res) => {
        res.render('./user/signUp')
    },
    /**
    * 담당자 : 정희성
    * 함수 내용 : 작성된 내용을 유저 DB에 저장해주는 함수
    * 주요 기능 : 사번을 통해 중복 검사 후 없을 시 저장해주는 기능
     *          중복 검사하여 존재할 시 메시지로 알려주는 기능
    **/
    saveUser: (req, res) => {
        const user = new User(req.body);
        // 사번을 통해 중복 검사
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
    emailConfiguration: (req, res) => {
        let ranNum = Math.floor(Math.random()*(999999-111111)) + 111111;
        if (req.body.email === "") {
            res.json({sendSuccess: false});
        } else {
            Aws.awsEMail(req.body.email,ranNum);
            res.json({sendSuccess: true, random: ranNum})
        }
    }
    /*findUser: (req, res) => {
        User.findOne({workNumber: req.workNumber}, (err, result) => {
            if (result != null) {
                res.json({message: "이미 존재하는 사번입니다."})
            }
        })
    }*/
}


module.exports = signUp;