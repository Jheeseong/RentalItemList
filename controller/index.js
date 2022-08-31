const { User } = require('../models/User')
const jwt = require("../config/jwt/jwt");

const index = {
    index: async (req, res) => {
        console.log(req.code, req.message);
        if(req.code)
            return res.redirect("/login");
        res.render('index', { title: 'Express' });
    },
}


module.exports = index;