/**
* 담당자 : 정희성
* 파일 내용 : 카테고리를 DB에 저장 혹은 찾는 기능이 작성된 자바스크립트 파일
**/
const { Category } = require('../../models/Category')

const category = {
    /**
     * 담당자 : 정희성
     * 함수 내용 : 카테고리를 DB에 저장하는 함수
     * 주요 기능 : 우선 프론트에서 받은 정보가 DB에 있는지 체크 후 없을 경우 DB에 저장하는 기능
     *           대분류 카테고리가 있을 경우 해당 카테고리에 소분류 카테고리를 업데이트 해주는 기능
     *           대분류 카테고리와 소분류 카테고리 둘 다 있는 경우 패스해주는 기능
     **/
    saveCategory: (req, res) => {
        let category;
        Category.findOne({name: req.params.keyword}, async (err, result) => {
            //프론트에서 받아온 대분류카테고리 값이 없는 경우
            if (result === null) {
                console.log(result)
                category = new Category(req.body);
                //MongoDB에서 오는 method, 정보들이 category model에 저장
                category.save((err) => {
                    //저장할 때 err 발생 시 json으로 반환
                    if (err) return res.json({success: false, err})
                    console.log(("category DB 저장 완료"))
                    return res.json({categorySuccess: true})
                        .status(200)
                });
                //프론트에서 받아온 대분류카테고리 값이 있는 경우
            } else {
                for (let child of result.children) {
                    //프론트에서 받아온 소분류카테고리 값이 있는 경우 저장하지않고 패스
                    if (child === req.body.children) {
                        return res.json({categorySuccess: false})
                    }
                }
                //프론트에서 받은 소분류 카테고리 값이 없을 경우 update
                Category.updateOne(
                    {name: result.name},
                    {$push: {children: req.body.children}},
                    (err) => {
                        if (err) {
                            window.alert("저장 실패");
                            console.log(err)
                        }
                        console.log(("category DB 중복 저장 완료"))
                        res.json({categorySuccess: true})
                            .status(200)
                    });
            }
        });

    },
    /**
    * 담당자 : 정희성
    * 함수 내용 : 대분류 카테고리를 찾아오는 함수
    * 주요 기능 : DB에 저장된 대분류 카테고리를 모두 찾아와서 categories로 반환
    **/
    findParentCategory: async (req, res) => {
        Category.find({}, async (err, categories) => {
            res.json({categories});
        })
    },
    /**
    * 담당자 : 정희성
    * 함수 내용 : 대분류 카테고리에 포함되어 있는 소분류 카테고리를 찾아오는 함수
    * 주요 기능 : 대분류 카테고리가 담긴 keyword를 통해 포함된 소분류 카테고리를 찾아오는 기능
     *           대분류 카테고리 내 소분류 카테고리가 배열로 저장되어 있어서 해당 대분류 카테고리 하나만 찾아오는 기능(findOne)
    **/
    findChildCategoryByParent: async (req, res) => {
        Category.findOne({name: req.params.keyword}, async (err, result) => {
            res.json({children: result});
        });
    }
}
//모듈을 export하여 라른 자바스크립트에서도 사용 가능하게 함
module.exports = category;