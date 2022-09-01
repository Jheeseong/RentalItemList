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
        Category.find({});
    }
}


module.exports = itemManagement;