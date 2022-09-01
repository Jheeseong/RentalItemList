const jwt = require("../config/jwt/jwt");
const { Item } = require("../models/Item");
const { Category } = require('../models/Category');

const itemManagement = {
    index: async (req, res) => {
        Item.find({}, async(err, result) => {
            res.render('ItemManagement', { items : result });
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
    }
}


module.exports = itemManagement;