const { Category } = require('../models/Category')

const createCategory = {
    saveCategory: async (req, res) => {
        const category = new Category(req.body);
        //MongoDB에서 오는 method, 정보들이 category model에 저장
        category.save((err) => {
            //저장할 때 err 발생 시 json으로 반환
            if (err) return res.json({success: false, err})
            console.log(("category DB 저장 완료"))
            return res.json(category)
                .status(200)
        })
    },
}

module.exports = createCategory;