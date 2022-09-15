const { Rent } = require('../models/rent')
const jwt = require("../config/jwt/jwt");

const rentalStatus = {
    index: (req, res) => {
        const rentingInfo = Rent.find({rentStatus : false})
            .populate("itemInfo")
            .exec();

        res.render('rentalStatus',{
            rentingInfo,
            name: req.name,
            workNumber: req.workNumber
        })
    },
}

module.exports = rentalStatus;