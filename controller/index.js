const { User } = require('../models/User')

const index = {
    index: async (req, res) => {
        res.render('index', { title: 'Express' });
    }
}

module.exports = index;