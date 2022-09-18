const { Rent } = require('../models/rent')
const { Item } = require('../models/Item')

const rentRecord = {
    index : (req, res) => {
        Rent.find({})
            .populate("itemInfo")
            .sort({rentDate : -1, returnDate: -1})
            .exec((err, result) => {
            res.render('./rent/rentRecord', {name : req.name, rentRecord : result,
                workNumber: req.workNumber,
                authority : req.authority});
        })
    }
}

module.exports = rentRecord;