const { Rent } = require('../models/rent')
const jwt = require("../config/jwt/jwt");

const rentalStatus = {
    index: (req, res) => {
        Rent.find({})
            .populate("itemInfo")
            .sort({rentDate : -1, returnDate: -1})
            .exec((err, rentRecord) => {
                Rent.find({rentStatus : true})
                    .populate("itemInfo")
                    .sort({rentDate: -1})
                    .exec((err, rentalStatus) => {
                        res.render('./rent/rentalStatus',{
                            rentingInfo: rentalStatus,
                            name: req.name,
                            workNumber: req.workNumber,
                            authority: req.authority,
                            rentRecord: rentRecord
                        });
                    });
            });
    },
}

module.exports = rentalStatus;