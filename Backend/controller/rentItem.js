const { Rent } = require('../models/rent')
const { Item } = require('../models/Item')

const rentItem = {
    rentItem: async (req, res) => {
        const rentItem = new Rent({
            rentStatus : req.body.returnAvailable,
            userName : req.name,
            workNumber : req.workNumber,
            itemCode : req.body.itemCode,
            purpose : req.body.purpose,
            rentDate : req.body.rentDate,
            returnPlanDate : req.body.returnAvailable ? req.body.returnPlanDate : null,
            itemInfo: req.body.itemId,
            userInfo: req.user_id
        });

        Item.findOne({_id : req.body.itemId})
            .select('count available')
            .exec((err, result) => {
                if(result.count.all === result.count.renting || result.available.rental === false){
                    console.log("물품 잔여 갯수 부족");
                    return res.json({ message : "물품 잔여 갯수 부족"});
                }
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