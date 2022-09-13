const { Rent } = require('../models/rent')
const { Item } = require('../models/Item')
const jwt = require("../config/jwt/jwt");

const myRental = {
    index: async (req, res) => {
        const filter = [
            {
              '$match':{
                  'workNumber' : req.workNumber
              }
            },
            {
                '$lookup': {
                    'from': 'items',
                    'localField': 'itemCode',
                    'foreignField': 'code',
                    'as': 'itemInfo'
                }
            }, {
                '$unwind': {
                    'path': '$itemInfo'
                }
            }, {
                '$addFields': {
                    'itemName': '$itemInfo.name',
                    'category': '$itemInfo.category',
                    'itemNumber': '$itemInfo.number'
                }
            }, {
                '$project': {
                    'userName': 1,
                    'workNumber': 1,
                    'itemNumber': 1,
                    'itemCode': 1,
                    'itemName': 1,
                    'category': 1,
                    'purpose': 1,
                    'rentDate': 1,
                    'returnPlanDate': 1
                }
            }
        ];

        Rent.aggregate((filter), async(err, result) => {
            console.log(result);
            res.render('myRental', {
                name: req.name,
                workNumber: req.workNumber,
                rentInfo: result
            });
        });




    },
}


module.exports = myRental;