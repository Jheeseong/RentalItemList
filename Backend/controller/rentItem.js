const { Rent } = require('../models/rent')

const rentItem = {
    rentItem: async (req, res) => {
        const item = new Rent({
            userName : req.name,
            workNumber : req.workNumber,
            itemCode : req.body.itemCode,
            purpose : req.body.purpose,
            rentDate : req.body.rentDate,
            returnPlanDate : req.body.returnPlanDate
        });
        item.save((err) => {
            if(err){
                return console.log(err);
            }
            return res.json({rentSuccess : true});
        })
    }
}

module.exports = rentItem;