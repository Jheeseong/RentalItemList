const { Item } = require("../models/Item")
const { Category } = require("../models/Category")

const itemEdit = {
    index: async (req, res) => {
        Item.findOne({_id: req.params.id}, async(err, items) =>{
            Category.find({}, async (err, categories) => {
                res.json({item : items, categories : categories})
                console.log(items, categories)
            });
        });
    }
}

module.exports = itemEdit;