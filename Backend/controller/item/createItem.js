/**
* 담당자 : 정희성
* 파일 설명 : 아이템을 저장하는 기능이 작성된 자바스크립트 파일
**/
const { Item } = require('../../models/Item')

const createItem = {
    /**
    * 담당자 : 정희성
    * 함수 내용 : 아이템을 DB에 저장하는 함수
    * 주요 기능 : 프론트에서 받아온 정보를 DB에 저장하는 기능
     *           프론트에 작성된 내용 중 물품코드 혹은 이름이 작성되어 있지 않는 경우 메시지로 알려주는 기능
     *           프론트에서 받은 정보 중 물품 코드가 중복되는지 판단 후 저장
    **/
    saveItem: async (req, res) => {
        const item = new Item(req.body);
        //프론트에서 받은 정보 중 물품코드 혹은 이름이 작성되어있는지 판단
        if (req.body.code === "" || req.body.name == "") {
            res.json({message: "물품 내용을 작성해주세요!"});
        } else {
            // 작성된 물품 코드가 DB에 겹치는 것이 없는지 판단하여 없는 경우 저장
            Item.findOne({code: req.body.code}, (err, findItem) => {
                if (findItem === null) {
                    item.save((err) => {
                        //MongoDB에서 오는 Method, 정보들이 Item model에 저장
                        //저장 할 때 err가 있다면 client에 err가 있다고 전달 -> 전달을 할 때 json 형식으로 전달
                        if (err) {
                            console.log(err);
                            return res.status(400)
                                .json({success: false, err})
                        }
                        // 성공했을시 json 형식으로 정보 전달
                        console.log("DB 저장 완료!")
                        res.json({message: "물품등록이 되었습니다!"})
                    });
                } else {
                    res.json({message: req.body.name + " 물품은 이미 등록된 물품입니다."})
                }
            });
        }
    }
}

module.exports = createItem;