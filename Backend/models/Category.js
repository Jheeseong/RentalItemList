const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
    name:{
        type : String
    },
    children: {
        type : [String]
    }

});

const Category = mongoose.model('Category', CategorySchema);

module.exports = { Category };