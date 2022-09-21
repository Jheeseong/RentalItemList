const { Item } = require("../../models/Item")
const { Category } = require("../../models/Category")

const itemEdit = {
    index: async (req, res) => {
        Item.findOne({_id: req.params.id}, async(err, items) =>{
            Category.find({}, async (err, categories) => {
                res.json({item : items, categories : categories})
            });
        });
    },
    updateItem: async (req, res) => {
        Item.updateOne({_id: req.params.id},
            {
                "category.parentCategory": req.body.category.parentCategory,
                "category.childCategory": req.body.category.childCategory,
                name: req.body.name,
                code: req.body.code,
                "count.all": req.body.count.all,
                "available.rental": req.body.available.rental,
                "available.return": req.body.available.return,
                updateDate: new Date()
                },
            async(err, items) => {
            if (err) console.log(err);
            else res.json({item : items})
        });
    }
}

module.exports = itemEdit;