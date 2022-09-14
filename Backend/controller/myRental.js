const { Rent } = require('../models/rent')
const { Item } = require('../models/Item')
const jwt = require("../config/jwt/jwt");

const myRental = {
    index: async (req, res) => {
        /* aggregate를 사용해 데이터를 바인딩하는 방법 */
        // const filter = [
        //     {'$match':{'workNumber' : req.workNumber}},
        //     {'$lookup': {'from': 'items', 'localField': 'itemCode', 'foreignField': 'code', 'as': 'itemInfo'}},
        //     {'$unwind': {'path': '$itemInfo'}},
        //     {'$addFields': {'itemName': '$itemInfo.name', 'category': '$itemInfo.category', 'itemNumber': '$itemInfo.number'}},
        //     {'$project': {'userName': 1, 'workNumber': 1, 'itemNumber': 1, 'itemCode': 1, 'itemName': 1, 'category': 1, 'purpose': 1, 'rentDate': 1, 'returnPlanDate': 1}}];
        //
        // Rent.aggregate((filter), async(err, result) => {
        //     res.render('myRental', {
        //         name: req.name,
        //         workNumber: req.workNumber,
        //         rentInfo: result
        //     });
        // });

        /* populate 사용 */
        const rentInfo = await Rent.find({$and : [{workNumber : req.workNumber}, {rentStatus : true} ]})
            .populate("itemInfo")
            .exec();

        const returnInfo = await Rent.find({$and : [{workNumber : req.workNumber}, {rentStatus : false} ]})
            .populate("itemInfo")
            .exec();

        res.render('myRental', {rentInfo, returnInfo, name: req.name, workNumber: req.workNumber});

    },
    returnItem: (req, res) => {
        Rent.findOneAndUpdate({_id: req.params.rentId},
            {$set : {returnDate : new Date(), rentStatus : false}},
            function(err, result){
                if(err) console.log(err);
                else return res.json({returnSuccess : true, result});
            });

        Item.findOneAndUpdate({_id: req.params.itemId},
            {$pull : {rentInfo : req.params.rentId}, $inc : {"count.renting" : -1}},
            function(err, result){
                if(err) console.log(err);
                console.log(result);
            })

    },
}


module.exports = myRental;