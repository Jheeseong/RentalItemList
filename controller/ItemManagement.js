const jwt = require("../config/jwt/jwt");

const itemManagement = {
    index: async (req, res) => {
        res.render('ItemManagement');
    },
}


module.exports = itemManagement;