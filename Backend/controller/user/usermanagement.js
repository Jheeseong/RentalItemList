/**
* 담당자 : 정희성
* 파일 설명 : 유저 관리 기능이 작성된 자바 스크립트 파일
**/
const { User } = require('../../models/User');
const { Rent } = require("../../models/rent");
const { Item } = require("../../models/Item");

const userManagement = {
    /**
    * 담당자 : 정희성
    * 함수 내용 : 유저들의 정보를 가져오는 함수
    * 주요 기능 : 유저 관리 페이지를 가져오는 기능
     *           유저 정보들을 가져오는 기능
    **/
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
    /**
    * 담당자 : 정희성
    * 함수 내용 : 유저를 삭제하는 함수
    * 주요 기능 : 접속한 유저가 본인의 정보를 삭제 못하도록 하는 기능
     *           삭제하는 유저가 대여한 물품이 있을 시 반납처리하고 대여 중인 카운트를 하나 뺴주는 기능
     *           유저가 대여한 물품의 대여가능 수가 0이라서 대여 불가능 처리가 되어있을 경우 대여 가능 카운트를 올리고 대여 가능으로 변경하는 기능
    **/
    deleteById: (req, res) => {
        // 접속 유저가 본인을 삭제하지 못하도록 하는 기능
        User.findOne({_id: req.params.id}, async (err, user) => {
            if (user.workNumber === req.workNumber) {
                res.json({message: "유저를 삭제할 수 없습니다!"});
            } else {
                //삭제하는 유저가 대여한 물품이 있는지 체크
                Rent.find({$and : [{workNumber : user.workNumber}, {rentStatus : true} ]})
                    .populate("itemInfo")
                    .exec((err,findRent) => {
                        // 있는 경우 대여 중 카운트 하나를 제거
                        findRent.map(rent => {
                            Item.findOneAndUpdate({_id: rent.itemInfo},
                                {$pull : {rentInfo : rent._id}, $inc : {"count.renting" : -1}},
                                function(err, findItem){
                                    if(err) res.json({message: "유저를 삭제할 수 없습니다."})
                                    // 유저가 대여한 물품의 카운터가 0이라서 대여가 불가능하다고 되어있는 경우
                                    if(findItem.available.rental === false && findItem.count.renting === findItem.count.all){
                                        // 대여 불가능을 가능으로 변환
                                        Item.findOneAndUpdate({_id: rent.itemInfo},
                                            {$set: {"available.rental" : true}},
                                            function(err, result){
                                                if(err) res.json({message: "유저를 삭제할 수 없습니다."});
                                            });
                                    }
                                });
                        })
                    });
                //유저가 대여한 물품을 반납했다고 업데이트, 추방 시간으로 반납 시간 처리
                Rent.updateMany({$and : [{workNumber : user.workNumber}, {rentStatus : true} ]},
                    {$set : {returnDate : new Date(), rentStatus : false}},
                    function (err){if (err) res.json({message: "유저를 삭제할 수 없습니다."})})
                //위 상황을 처리 후 유저 삭제
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
    /**
    * 담당자 : 정희성
    * 함수 내용 : 편집 권한을 변경해주는 함수
    * 주요 기능 : 편집 권한이 불가능일 경우 가능으로 변경하는 기능
     *           편집 권한이 가능일 경우 불가능으로 변경하는 기능
     *           변경 후 메시지를 통해 알려주는 기능
    **/
    AuthorityEdit: (req, res) => {
        User.findOne({_id: req.params.id}, (err, user) => {
            if (user.authority.editAuthority) {
                User.updateOne({_id: req.params.id},
                    {$set: {"authority.editAuthority": false}},
                    (err) => {
                        if (err){res.json({message: "에러가 발생하였습니다."})}
                        else {
                            res.json({message: "편집 권한 불가능!"})
                        }

                });
            } else {
                User.updateOne({_id: req.params.id},
                    {$set: {"authority.editAuthority": true}},
                    (err) => {
                        if (err) res.json({message: "에러가 발생하였습니다."})
                        else res.json({message: "편집 권한 가능!"})
                    });
            }
        })

    },
    /**
     * 담당자 : 정희성
     * 함수 내용 : 대여 권한을 변경해주는 함수
     * 주요 기능 : 대여 권한이 불가능일 경우 가능으로 변경하는 기능
     *           대여 권한이 가능일 경우 불가능으로 변경하는 기능
     *           변경 후 메시지를 통해 알려주는 기능
     **/
    AuthorityRental: (req, res) => {
        User.findOne({_id: req.params.id}, (err, user) => {
            if (user.authority.rentalAuthority) {
                User.updateOne({_id: req.params.id},
                    {$set: {"authority.rentalAuthority": false}},
                    (err, result) => {
                        if (err) res.json({message: "에러가 발생하였습니다."});
                        else res.json({message: "대여 권한 불가능!"})
                    });
            } else {
                User.updateOne({_id: req.params.id},
                    {$set: {"authority.rentalAuthority": true}},
                    (err, result) => {
                        if (err) res.json({message: "에러가 발생하였습니다."});
                        else res.json({message: "대여 권한 가능!"})
                    });
            }
        })

    },
    /**
     * 담당자 : 정희성
     * 함수 내용 : 열람 권한을 변경해주는 함수
     * 주요 기능 : 열람 권한이 불가능일 경우 가능으로 변경하는 기능
     *           열람 권한이 가능일 경우 불가능으로 변경하는 기능
     *           변경 후 메시지를 통해 알려주는 기능
     **/
    AuthorityOpen: (req, res) => {
        User.findOne({_id: req.params.id}, (err, user) => {
            if (user.authority.openAuthority) {
                User.updateOne({_id: req.params.id},
                    {$set: {"authority.openAuthority": false}},
                    (err, result) => {
                        if (err) res.json({message: "에러가 발생하였습니다."});
                        else res.json({message: "열람 권한 불가능!"})
                    });
            } else {
                User.updateOne({_id: req.params.id},
                    {$set: {"authority.openAuthority": true}},
                    (err, result) => {
                        if (err) res.json({message: "에러가 발생하였습니다."});
                        else res.json({message: "열람 권한 가능!"})
                    });
            }
        })

    },
    /**
     * 담당자 : 정희성
     * 함수 내용 : 관리자 권한을 변경해주는 함수
     * 주요 기능 : 관리자 권한이 불가능일 경우 가능으로 변경하는 기능
     *           관리자 권한이 가능일 경우 불가능으로 변경하는 기능
     *           변경 후 메시지를 통해 알려주는 기능
     **/
    AuthorityAdmin: (req, res) => {
        User.findOne({_id: req.params.id}, (err, user) => {
            if (user.authority.administrator) {
                User.updateOne({_id: req.params.id},
                    {$set: {"authority.administrator": false}},
                    (err, result) => {
                        if (err) res.json({message: "에러가 발생하였습니다."});
                        else res.json({message: "관리자 권한 불가능!"})
                    });
            } else {
                User.updateOne({_id: req.params.id},
                    {$set: {"authority.administrator": true}},
                    (err, result) => {
                        if (err) res.json({message: "에러가 발생하였습니다."});
                        else res.json({message: "관리자 권한 가능!"})
                    });
            }
        })

    },
    /**
    * 담당자 : 정희성
    * 함수 내용 : 비밀번호를 0405로 초기화 해주는 함수
    * 주요 기능 : 비밀번호를 0405로 초기화 후 메시지를 통해 알려주는 기능
    **/
    resetPassword: (req, res) => {
            User.updateOne({_id: req.params.id},
                {$set: {password: "0405"}},
                (err, result) => {
                    if (err) res.json({message: "에러가 발생하였습니다."});
                    else res.json({message: "비밀번호 초기화 완료!"})
                });
    }
}

module.exports = userManagement;