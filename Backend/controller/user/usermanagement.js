const { User } = require('../../models/User');

const userManagement = {
    index: (req, res) => {
        User.find({}, (err, users) => {
            res.render('./user/userManagement', {
                users: users,
                name: req.name,
                workNumber: req.workNumber,
                authority : req.authority
            });
        });
    },
    deleteById: (req, res) => {
        User.findOne({_id: req.params.id}, (err, user) => {
            if (user.workNumber === req.workNumber) {
                res.json({message: "유저를 삭제할 수 없습니다!"});
            } else {
                User.deleteOne({_id: req.params.id}, (err, result) => {
                    res.json({deleteSuccess : "success",
                        message: "이용자를 삭제하였습니다!",
                        result: result,
                    })
                });
            }
        })
    },
    AuthorityEdit: (req, res) => {
        User.findOne({_id: req.params.id}, (err, user) => {
            if (user.authority.editAuthority) {
                User.updateOne({_id: req.params.id},
                    {$set: {"authority.editAuthority": false}},
                    (err, result) => {
                        if (err) console.log(err);
                        else res.json({message: "편집 권한 불가능!"})
                    });
            } else {
                User.updateOne({_id: req.params.id},
                    {$set: {"authority.editAuthority": true}},
                    (err, result) => {
                        if (err) console.log(err);
                        else res.json({message: "편집 권한 가능!"})
                    });
            }
        })

    },
    AuthorityRental: (req, res) => {
        User.findOne({_id: req.params.id}, (err, user) => {
            if (user.authority.rentalAuthority) {
                User.updateOne({_id: req.params.id},
                    {$set: {"authority.rentalAuthority": false}},
                    (err, result) => {
                        if (err) console.log(err);
                        else res.json({message: "대여 권한 불가능!"})
                    });
            } else {
                User.updateOne({_id: req.params.id},
                    {$set: {"authority.rentalAuthority": true}},
                    (err, result) => {
                        if (err) console.log(err);
                        else res.json({message: "대여 권한 가능!"})
                    });
            }
        })

    },
    AuthorityOpen: (req, res) => {
        User.findOne({_id: req.params.id}, (err, user) => {
            if (user.authority.openAuthority) {
                User.updateOne({_id: req.params.id},
                    {$set: {"authority.openAuthority": false}},
                    (err, result) => {
                        if (err) console.log(err);
                        else res.json({message: "열람 권한 불가능!"})
                    });
            } else {
                User.updateOne({_id: req.params.id},
                    {$set: {"authority.openAuthority": true}},
                    (err, result) => {
                        if (err) console.log(err);
                        else res.json({message: "열람 권한 가능!"})
                    });
            }
        })

    },
    resetPassword: (req, res) => {
            User.updateOne({_id: req.params.id},
                {$set: {password: "0405"}},
                (err, result) => {
                    if (err) console.log(err);
                    else res.json({message: "비밀번호 초기화 완료!"})
                });
    }
}

module.exports = userManagement;