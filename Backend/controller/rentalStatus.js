const { Rent } = require('../models/rent')
const jwt = require("../config/jwt/jwt");

const rentalStatus = {
    index: (req, res) => {
        Rent.find({rentStatus : true})
            .populate("itemInfo")
            .sort({rentDate: -1})
            .exec((err, result) => {
                res.render('./rent/rentalStatus',{
                    rentingInfo: result,
                    name: req.name,
                    workNumber: req.workNumber,
                    authority : req.authority
                })
            });
    },
}

module.exports = rentalStatus;