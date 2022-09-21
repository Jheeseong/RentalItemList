const { User } = require('../models/User');
const { Item } = require('../models/Item');
const jwt = require("../config/jwt/jwt");
const {Rent} = require("../models/rent");

const index = {
    index: async (req, res) => {
        const newItems = await Item.find({}).sort({createDate : -1}).limit(6).exec();

        const hotItemFilter = [
            {'$match': {'delete': false }},
            {'$project': {'name': 1, 'code' : 1, 'category': 1, 'rentInfo': {'$size': '$rentInfo'}}},
            {'$sort': {'rentInfo': -1}},
            {'$limit': 5}];

        const hotItems = await Item.aggregate(hotItemFilter, error => {
            if(error) console.log(error);
        });

        const rentInfo = await Rent.find({$and : [{workNumber : req.workNumber}, {rentStatus : true} ]})
            .populate("itemInfo")
            .exec();

        res.render('index', {
            title: 'Heaventree Item Rental System',
            name: req.name,
            workNumber: req.workNumber,
            authority : req.authority,
            newItems, hotItems, rentInfo
        });
    },
    error: (req, res) => {
        res.render('errorUnauthorized', {
            code : "UNAUTHORIZED",
            message : "접근 권한이 없습니다."
        })
    }
}


module.exports = index;