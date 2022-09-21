const { Rent } = require('../../models/rent')
const { Item } = require('../../models/Item')
const { User } = require('../../models/User')
const jwt = require("../../config/jwt/jwt");

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
            .sort({rentDate : 1})
            .exec();

        const returnInfo = await Rent.find({$and : [{workNumber : req.workNumber}, {rentStatus : false} ]})
            .populate("itemInfo")
            .sort({rentDate : -1, returnDate: -1})
            .exec();

        const userInfo = await User.findOne({workNumber: req.workNumber})
            .exec();

        res.render('./rent/myRental', {userInfo, rentInfo, returnInfo, name: req.name, workNumber: req.workNumber, authority : req.authority});

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
                if(result.available.rental === false && result.count.renting === result.count.all){
                    Item.findOneAndUpdate({_id: req.params.itemId},
                        {$set: {"available.rental" : true}},
                        function(err, result){
                        if(err) console.log(err);
                        console.log("대여가능여부 true");
                    });
                }
        });

    },
    updateUser: (req, res) => {
        User.updateOne({workNumber: req.params.keyword},
            {
                $set: {name: req.body.name,
                    department: req.body.department,
                    role: req.body.role,
                    email: req.body.email,
                    }
            },
            (err, user) => {
            console.log(user)
            if (err) console.log(err);
            else res.json({user: user, message: "회원 수정이 완료되었습니다!"})
            });
    },

    updatePassword: (req, res) => {
        User.updateOne({workNumber: req.params.keyword},
            {
                $set: {password: req.body.password}
            },
            (err, user) => {
                console.log(user)
                if (err) console.log(err);
                else res.json({user: user, message: "비밀번호 수정이 완료되었습니다!"})
            });
    }
}


module.exports = myRental;