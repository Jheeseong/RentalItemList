const mongoose = require('mongoose');

/**
 * 담당자 : 강재민, 정희성
 * 함수 설명 : 카테고리 스키마
 * 기능 설명 : - 대분류이름과 소분류 배열로 구성
 */
const CategorySchema = mongoose.Schema({
    // 대분류 이름
    name:{
        type : String
    },
    // 소분류 배열
    children: {
        type : [String]
    }

});

const Category = mongoose.model('Category', CategorySchema);

module.exports = { Category };