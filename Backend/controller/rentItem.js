const { Rent } = require('../models/rent')
const { Item } = require('../models/Item')

const rentItem = {
    rentItem: async (req, res) => {
        const rentItem = new Rent({
            userName : req.name,
            workNumber : req.workNumber,
            itemCode : req.body.itemCode,
            purpose : req.body.purpose,
            rentDate : req.body.rentDate,
            returnPlanDate : req.body.returnPlanDate
        });

        /* 대여 정보 저장 */
        rentItem.save((err) => {
            if(err){
                return console.log(err);
            }

        })

        /* 물품 정보 수정(잔여 수량 감소, 대여자 명단 추가) */
        Item.findOneAndUpdate({code : req.body.itemCode},
            {$inc : {"count.remaining" : -1}, $push: {lender : {name : req.name, workNumber : req.workNumber}}},
            function (err, result){
                if(err){
                    console.log(err);
                }
                if(!result.count.remaining - 1){
                    Item.findOneAndUpdate({_id:result._id}, {$set : {"available.rental" : false}}, function (err, result){
                        if(err) console.log(err);
                        else console.log("대여불가 상태로 변경");
                    })
                }

            });

        return res.json({rentSuccess : true});;
    }
}

module.exports = rentItem;