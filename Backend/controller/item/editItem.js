/**
* 담당자 : 정희성
* 파일 설명 : 해당 물품의 정보 및 수정 시 필요한 카테고리 정보들을 가져오는 자바스크립트 파일
**/
const { Item } = require("../../models/Item")
const { Category } = require("../../models/Category")

const itemEdit = {
    /**
    * 담당자 : 정희성
    * 함수 내용 : 선택한 물품의 정보를 가져오는 함수
    * 주요 기능 : 선택한 물품의 id 값으로 물품 정보를 찾아오는 기능
     *           카테고리 편집 시 모든 카테고리 DB 정보가 필요하기 떄문에 모든 정보를 찾아오는 기능
     *           모탈 창 클릭 시 정보를 불러온 후 프론트에 전달하는 기능
    **/
    index: async (req, res) => {
        Item.findOne({_id: req.params.id}, async(err, items) =>{
            Category.find({}, async (err, categories) => {
                res.json({item : items, categories : categories})
            });
        });
    },
    /**
    * 담당자 : 정희성
    * 함수 내용 : 수정한 내용을 물품 DB에 저장해주는 함수
    * 주요 기능 : 해당 풀뭎의 id 값을 통해 찾은 후 업데이트 시켜 DB에 저장하는 기능
     *           업데이트 시 업데이트 한 현시간을 저장하는 기능
    **/
    updateItem: async (req, res) => {
        Item.updateOne({_id: req.params.id},
            {
                "category.parentCategory": req.body.category.parentCategory,
                "category.childCategory": req.body.category.childCategory,
                name: req.body.name,
                code: req.body.code,
                "count.all": req.body.count.all,
                "available.rental": req.body.available.rental,
                "available.return": req.body.available.return,
                updateDate: new Date()
                },
            async(err, items) => {
            if (err) console.log(err);
            else res.json({item : items})
        });
    }
}

module.exports = itemEdit;