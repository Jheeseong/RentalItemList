const { Item } = require("../models/Item");
const { Category } = require('../models/Category');

const itemManagement = {
    index: async (req, res) => {
        Item.find({}, async(err, items) => {
            Category.find({}, async(err, categories) => {
                res.render('ItemManagement', { items : items, categories : categories, name : req.name });
            });
        });

    },
    findAll: async (req, res) => {
        Item.find({}, async(err, result) => {
            res.json({ items : result });
        });
    },
    findByItem: async (req, res) => {
        let parentCategory = req.params.parentCategory;
        let childCategory = req.params.childCategory;
        if(parentCategory === "대분류 전체")
            parentCategory = "";
        if(childCategory === "소분류 전체")
            childCategory = "";

        Item.find({$and : [{ name : { $regex: req.params.keyword}}, {"category.parentCategory" : { $regex : parentCategory}}, {"category.childCategory" : {$regex : childCategory}}]}, async(err, result) =>{
            res.json({ items : result});
        });
    },
    findByLender: async (req, res) => {
        let parentCategory = req.params.parentCategory;
        let childCategory = req.params.childCategory;
        if(parentCategory === "대분류 전체")
            parentCategory = "";
        if(childCategory === "소분류 전체")
            childCategory = "";

        Item.find({$and : [{lender : {$elemMatch : {name : req.params.keyword}}},{"category.parentCategory" : { $regex : parentCategory}}, {"category.childCategory" : {$regex : childCategory}}]}, async(err, result) =>{
            res.json({ items : result });
        });
    },
    findByParentCategory : async(req, res) => {
        Item.find({ "category.parentCategory" : req.params.keyword}, async(err, result) => {
            res.json({ items : result});
        });
    },
    findByChildCategory : async(req, res) => {
        Item.find({"category.childCategory" : req.params.keyword}, async(err, result) => {
            res.json({ items : result});
        });
    },
    deleteById: async(req, res) => {
        Item.deleteOne({_id: req.params.id}, async(err, result) => {
            res.json({ deleteSuccess : "Success", message : "물품이 성공적으로 삭제되었습니다.", result : result });
        })
    }
}


module.exports = itemManagement;