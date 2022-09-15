const { User } = require('../models/User')
const jwt = require("../config/jwt/jwt");

const index = {
    index: async (req, res) => {
        res.render('index', {
            title: 'Heaventree Item Rental System',
            name: req.name,
            workNumber: req.workNumber
        });
    },
    error: (req, res) => {
        res.render('errorUnauthorized', {
            code : "UNAUTHORIZED",
            message : "접근 권한이 없습니다."
        })
    }
}


module.exports = index;