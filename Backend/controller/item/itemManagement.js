const { Item } = require("../../models/Item");
const { Rent } = require("../../models/rent");
const { Category } = require('../../models/Category');
/**
 * 담당자 : 강재민
 * 파일 설명 : 물품관리페이지의 Service기능을 담당하는 JavaScript 파일 입니다.
 */


const itemManagement = {
    /**
     * 담당자 : 강재민
     * 함수 설명 : 물품 관리 페이지 렌더링
     * 기능 설명 : - 삭제되지 않은 물품 전체 검색하였습니다.
     *              - populate 를 사용하여 대여 정보를 함께 검색하였습니다.
     *              - 검색로직을 위해 분류를 검색하였습니다.
     *              - 물품정보와 분류 데이터를 함께 response에 담아 물품정보페이지를 렌더링 하였습니다.
     */
    index: async (req, res) => {
        Item.find({delete : false})
            .populate("rentInfo")
            .exec((err, items) => {
                if(err) return console.log(err);
                Category.find({}, async(err, categories) => {
                    res.render('./item/ItemManagement',
                        {items, categories, name: req.name,
                        workNumber: req.workNumber,
                        authority : req.authority});
                })
            })

    },
    /**
     * 담당자 : 강재민
     * 함수 설명 : 전체 물품 탐색
     * 기능 설명 : - 삭제되지 않은 물품 전체 검색하였습니다.
     *              - populate 를 사용하여 대여 정보를 함께 검색하였습니다.
     *              - 대분류를 전체로 선택했을 경우에 실행됩니다.
     */
    findAll: async (req, res) => {
        Item.find({delete : false})
            .populate("rentInfo")
            .exec(async(err, items) => {
            res.json({ items, authority : req.authority });
        });
    },
    /**
     * 담당자 : 강재민
     * 함수 설명 : 물품명으로 물품 검색
     * 기능 설명 : - 물품명으로 물품정보를 검색하였습니다.
     *              - populate 를 사용하여 대여 정보를 함께 검색하였습니다.
     *              - 대분류, 소분류, 검색키워드에 모두 해당하는 물품정보만을 검색하여 return 하였습니다.
     */
    findByItem: async (req, res) => {
        let parentCategory = req.params.parentCategory;
        let childCategory = req.params.childCategory;
        if(parentCategory === "대분류 전체")
            parentCategory = "";
        if(childCategory === "소분류 전체")
            childCategory = "";

        Item.find({$and : [{ name : { $regex: req.params.keyword}}, {"category.parentCategory" : { $regex : parentCategory}}, {"category.childCategory" : {$regex : childCategory}}, {delete : false}]})
            .populate("rentInfo")
            .exec(async(err, items) =>{
            res.json({ items, authority : req.authority });
        });
    },
    /**
     * 담당자 : 강재민
     * 함수 설명 : 대여자명으로 검색
     * 기능 설명 : - 삭제되지 않은 물품을 대여자명으로 검색하였습니다.
     *              - populate 를 사용하여 대여 정보를 함께 검색하였습니다.
     *              - 대분류, 소분류, 검색키워드에 모두 해당하는 물품정보만을 검색하여 return 하였습니다.
     *              - 열람권한이 없으면 API에 접근할 수 없도록 미들웨어를 사용하여 제한하였습니다.
     */
    findByLender: async (req, res) => {
        let parentCategory = req.params.parentCategory;
        let childCategory = req.params.childCategory;
        if(parentCategory === "대분류 전체")
            parentCategory = "";
        if(childCategory === "소분류 전체")
            childCategory = "";

        Item.find({$and : [{"category.parentCategory" : { $regex : parentCategory}}, {"category.childCategory" : {$regex : childCategory}}, {delete : false}]})
            .populate({ path : "rentInfo",  match : { userName :{ $regex : req.params.keyword }}})
            .exec(async(err, items) =>{
                // 대여자가 있는 아이템만 구분
                let item = new Array();
                items.map((res) =>{
                    if(res.rentInfo.length){
                        item.push(res);
                    }
                });
                console.log(items);
                res.json({ items : item , authority : req.authority});
        });
    },
    /**
     * 담당자 : 강재민
     * 함수 설명 : 대분류로 물품 검색
     * 기능 설명 : - 삭제되지 않은 물품을 대분류로 검색하였습니다.
     *              - populate 를 사용하여 대여 정보를 함께 검색하였습니다.
     *              - 대분류에 해당하는 물품정보만을 검색하여 return 하였습니다.
     */
    findByParentCategory : async(req, res) => {
        Item.find({$and: [{"category.parentCategory": req.params.keyword}, {delete: false}]})
            .populate("rentInfo")
            .exec( async(err, items) => {
            res.json({ items , authority : req.authority});
        });
    },
    /**
     * 담당자 : 강재민
     * 함수 설명 : 소분류로 물품 검색
     * 기능 설명 : - 삭제되지 않은 물품을 소분류로 검색하였습니다.
     *              - populate 를 사용하여 대여 정보를 함께 검색하였습니다.
     *              - 소분류에 해당하는 물품정보만을 검색하여 return 하였습니다.
     */
    findByChildCategory : async(req, res) => {
        Item.find({$and : [{"category.childCategory" : req.params.keyword}, {delete : false}]})
            .populate("rentInfo")
            .exec(async(err, items) => {
            res.json({ items, authority : req.authority });
        });
    },
    /**
     * 담당자 : 강재민
     * 함수 설명 : 물품 삭제
     * 기능 설명 : - 물품 삭제 시 해당 물품의 delete 컬럼을 false로 변경해주었습니다.
     *              - 물품이 삭제되어도 대여이력에서의 물품정보는 남아있어야 하기 때문에, 물품을 완전히 삭제하기보다는 물품정보는 그대로 남겨놓는 방법을 선택하였습니다.
     */
    deleteById: async(req, res) => {
        Item.findOneAndUpdate({_id: req.params.id},{ delete: true } ,async(err, result) => {
            res.json({ deleteSuccess : "Success", message : "물품이 성공적으로 삭제되었습니다.", result : result });
        })
    },
    /**
     * 담당자 : 강재민
     * 함수 설명 : 물품별 대여 이력
     * 기능 설명 : - 아이템의 _id로 Rent 도큐먼트에서 모든 이력을 조회하였습니다.
     *              - 대여중인 아이템부터 보이도록 반환하였습니다.
     */
    rentHistory: async(req, res) => {
        Rent.find({ itemInfo : req.params.itemId})
            .sort({rentStatus : -1})
            .exec(async (err, histories) => {
                if(err) console.log(err);
                res.json({ histories })
            })
    }
}


module.exports = itemManagement;