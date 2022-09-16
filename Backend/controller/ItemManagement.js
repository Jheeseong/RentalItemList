const { Item } = require("../models/Item");
const { Rent } = require("../models/rent");
const { Category } = require('../models/Category');

const itemManagement = {
    index: async (req, res) => {
        Item.find({delete : false})
            .populate("rentInfo")
            .exec((err, items) => {
                if(err) return console.log(err);
                Category.find({}, async(err, categories) => {
                    res.render('./item/ItemManagement', {items, categories, name: req.name});
                })
            })

    },
    findAll: async (req, res) => {
        Item.find({delete : false})
            .populate("rentInfo")
            .exec(async(err, items) => {
            res.json({ items });
        });
    },
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
            res.json({ items });
        });
    },
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
                res.json({ items : item });
        });
    },
    findByParentCategory : async(req, res) => {
        Item.find({$and: [{"category.parentCategory": req.params.keyword}, {delete: false}]})
            .populate("rentInfo")
            .exec( async(err, items) => {
            res.json({ items });
        });
    },
    findByChildCategory : async(req, res) => {
        Item.find({$and : [{"category.childCategory" : req.params.keyword}, {delete : false}]})
            .populate("rentInfo")
            .exec(async(err, items) => {
            res.json({ items });
        });
    },
    deleteById: async(req, res) => {
        Item.findOneAndUpdate({_id: req.params.id},{ delete: true } ,async(err, result) => {
            res.json({ deleteSuccess : "Success", message : "물품이 성공적으로 삭제되었습니다.", result : result });
        })
    },
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