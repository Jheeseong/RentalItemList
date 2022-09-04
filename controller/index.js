const { User } = require('../models/User')
const jwt = require("../config/jwt/jwt");

const index = {
    index: async (req, res) => {
        res.render('index', {
            title: 'Express',
        });
    },
}


module.exports = index;