const { User } = require('../../models/User');
const { Rent } = require("../../models/rent");
const { Item } = require("../../models/Item");

const userManagement = {
    index: (req, res) => {
        User.find({}, (err, users) => {
            res.render('./user/userManagement', {
                users: users,
                name: req.name,
                workNumber: req.workNumber
            });
        });
    },
    deleteById: (req, res) => {
        User.findOne({_id: req.params.id}, async (err, user) => {
            if (user.workNumber === req.workNumber) {
                res.json({message: "유저를 삭제할 수 없습니다!"});
            } else {
                Rent.find({$and : [{workNumber : user.workNumber}, {rentStatus : true} ]})
                    .populate("itemInfo")
                    .exec((err,findRent) => {
                        console.log(findRent)
                        findRent.map(rent => {
                            console.log(rent)
                            Item.findOneAndUpdate({_id: rent.itemInfo},
                                {$pull : {rentInfo : rent._id}, $inc : {"count.renting" : -1}},
                                function(err, findItem){
                                    if(err) console.log(err);
                                    if(findItem.available.rental === false && findItem.count.renting === findItem.count.all){
                                        Item.findOneAndUpdate({_id: rent.itemInfo},
                                            {$set: {"available.rental" : true}},
                                            function(err, result){
                                                if(err) console.log(err);
                                                console.log("대여가능여부 true");
                                            });
                                    }
                                });
                        })
                    });

                Rent.updateMany({$and : [{workNumber : user.workNumber}, {rentStatus : true} ]},
                    {$set : {returnDate : new Date(), rentStatus : false}},
                    function (err){if (err) console.log(err)})

                User.deleteOne({_id: req.params.id}, (err, result) => {
                    res.json({
                        deleteSuccess: "success",
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
                    (err) => {
                        if (err){console.log(err);}
                        else {
                            res.json({message: "편집 권한 불가능!"})
                        }

                });
            } else {
                User.updateOne({_id: req.params.id},
                    {$set: {"authority.editAuthority": true}},
                    (err) => {
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