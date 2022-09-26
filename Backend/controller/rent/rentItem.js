const { Rent } = require('../../models/rent')
const { Item } = require('../../models/Item')
/**
 * 담당자 : 강재민
 * 파일 설명 : 물품대여의 Service기능을 담당하는 JavaScript 파일 입니다.
 */

const rentItem = {
    /**
     * 담당자 : 강재민
     * 함수 설명 : 물품 대여 함수
     * 기능 설명 : - 대여 데이터를 넘겨 받아 데이터 가공
     *              - 물품 잔여 갯수가 부족할 시 return
     *              - 대여정보를 rents 컬렉션에 저장
     *              - 물품 정보에서 대여중수량 증가, 대여정보 추가
     *              - 물품 대여 후 잔여수량이 부족할 경우 대여가능여부를 false로 변경
     */
    rentItem: (req, res) => {
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

        // 물품 잔여 갯수 확인
        Item.findOne({_id : req.body.itemId})
            .select('count available')
            .exec((err, result) => {
                if(result.count.all === result.count.renting || result.available.rental === false){
                    console.log("물품 잔여 갯수 부족");
                    return res.json({ message : "물품 잔여 갯수 부족"});
                }
            });

        // 대여 정보 저장
        rentItem.save((err, saveResult) => {
            if(err){
                return console.log(err);
            }

            // 물품 정보 수정(잔여 수량 감소, 대여자 명단 추가)
            Item.findOneAndUpdate({_id : req.body.itemId},
                {$inc : {"count.renting" : 1}, $push:{ rentInfo : saveResult._id }},
                function (err, updateResult){
                    if(err){
                        console.log(err);
                    }
                    // 물품 대여 후 잔여수량이 부족할 경우 대여가능여부를 false로 변경
                    if(updateResult.count.renting + 1 === updateResult.count.all){
                        Item.findOneAndUpdate({_id:updateResult._id}, {$set : {"available.rental" : false}}, function (err, result){
                            if(err) console.log(err);
                            else console.log("대여불가 상태로 변경");
                        })
                    }
            });
        });

        // 대여 성공 여부 반환
        return res.json({rentSuccess : true});;
    }
}

module.exports = rentItem;