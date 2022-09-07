const { Category } = require('../models/Category')

const category = {
    saveCategory: async (req, res) => {
        Category.findOne({name: req.params.keyword}, async(err, result) => {
            let category;
            if (result === null) {
                category = new Category(req.body);
                //MongoDB에서 오는 method, 정보들이 category model에 저장
                category.save((err) => {
                    //저장할 때 err 발생 시 json으로 반환
                    if (err) return res.json({success: false, err})
                    console.log(("category DB 저장 완료"))
                    return res.json(category)
                        .status(200)
                });
            } else {
                console.log(req.body.children)
                Category.update(
                    {name: result.name},
                    {$push: {children: req.body.children}},
                    (err) => {
                        if (err) {
                            window.alert("저장 실패");
                            console.log(err)
                        }
                        console.log(("category DB 중복 저장 완료"))
                        return res.json(result)
                            .status(200)
                    });
            };
        });

    },
    findParentCategory: async (req, res) => {
        Category.find({}, async (err, categories) => {
            res.json({categories});
        })
    },
    findChildCategoryByParent: async (req, res) => {
        Category.findOne({name: req.params.keyword}, async (err, result) => {
            res.json({children: result});
        });
    }
}

module.exports = category;