const { Item } = require('../models/Item')
const { Category } = require('../models/Category')
const category = require('../controller/category')
const createItem = {
    saveItem: async (req, res) => {
        const item = new Item(req.body);
        // const loginUser = {username: req.name, workNumber: req.workNumber};
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
                    // 성공했을시에는 status 200 -> json 형식으로 정보 전달
                    console.log("DB 저장 완료!")
                    res.json({message: "물품등록이 되었습니다!"})
                });
            } else {
                res.json({message: req.body.name + " 물품은 이미 등록된 물품입니다."})
            }
        })
    }
}

module.exports = createItem;