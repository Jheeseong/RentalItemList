const { User } = require('../models/User')
const jwt = require("../config/jwt/jwt");

const index = {
    index: async (req, res) => {
        res.render('index', {
            title: 'Heaven Tree Item Lend System',
            name: req.name,
            workNumber: req.workNumber
        });
    },
}


module.exports = index;