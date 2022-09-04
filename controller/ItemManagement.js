const jwt = require("../config/jwt/jwt");
const { Item } = require("../models/Item");
const { Category } = require('../models/Category');

const itemManagement = {
    index: async (req, res) => {
        Item.find({}, async(err, items) => {
            Category.find({}, async(err, categories) => {
                res.render('ItemManagement', { items : items, categories : categories });
            });
        });

    },
    findAll: async (req, res) => {
        Item.find({}, async(err, result) => {
            res.json({ items : result });
        });
    },
    findByItem: async (req, res) => {
        Item.find( { name : { $regex: req.params.keyword}}, async(err, result) =>{
            res.json({ items : result});
        });
    },
    findByLender: async (req, res) => {
        Item.find({lender : {$elemMatch : {name : req.params.keyword}}}, async(err, result) =>{
            res.json({ items : result });
        });
    },
    findChildCategoryByParent: async(req, res) => {
        Category.findOne({name : req.params.keyword}, async(err, result) => {
           res.json({children : result});
        });
    },
    findByParentCategory : async(req, res) => {
        Item.find({ "category.parentCategory" : req.params.keyword}, async(err, result) => {
            res.json({ items : result});
            console.log(result);
        });
    },
    findByChildCategory : async(req, res) => {
        Item.find({"category.childCategory" : req.params.keyword}, async(err, result) => {
            res.json({ items : result});
        });
    }
}


module.exports = itemManagement;