const { Rent } = require('../models/rent')
const { Item } = require('../models/Item')

const rentItem = {
    rentItem: async (req, res) => {
        const rentItem = new Rent({
            rentStatus : true,
            userName : req.name,
            workNumber : req.workNumber,
            itemCode : req.body.itemCode,
            purpose : req.body.purpose,
            rentDate : req.body.rentDate,
            returnPlanDate : req.body.returnPlanDate,
            itemInfo: req.body.itemId,
            userInfo: req.user_id
        });

        /* 대여 정보 저장 */
        rentItem.save((err, saveResult) => {
            if(err){
                return console.log(err);
            }

            /* 물품 정보 수정(잔여 수량 감소, 대여자 명단 추가) */
            Item.findOneAndUpdate({_id : req.body.itemId},
                {$inc : {"count.renting" : 1}, $push:{ rentInfo : saveResult._id }},
                function (err, updateResult){
                    if(err){
                        console.log(err);
                    }
                    if(updateResult.count.renting + 1 === updateResult.count.all){
                        Item.findOneAndUpdate({_id:updateResult._id}, {$set : {"available.rental" : false}}, function (err, result){
                            if(err) console.log(err);
                            else console.log("대여불가 상태로 변경");
                        })
                    }
            });
        });

        return res.json({rentSuccess : true});;
    }
}

module.exports = rentItem;