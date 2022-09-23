const mongoose = require('mongoose'); // mongoose를 선언해주고,

/**
 * 담당자 : 강재민, 정희성
 * 함수 설명 : 물품 스키마
 * 기능 설명 : - 카테고리{대분류, 소분류}, 물품명, 물품번호, 물품코드, 갯수{전체, 대여중}, 가능여부{대여가능, 반납필요}, 대여정보(대여이력_id과 매핑), 최초등록일, 수정일, 삭제여부
 *              - 대여정보가 대여(rent) 스키마의 _id 로 mongoose를 이용해 매핑되어있습니다.
 */
const itemSchema = mongoose.Schema({  // userSchema라는 이름의 schema를 작성해준다.
    category: {
        parentCategory: {
            type : String
        },
        childCategory: {
            type : String
        },
    },
    name: {
        type: String,
        trim : true,
        index : true
    },
    code: {
        type: String,
        index: true,
        unique : true,
    },
    count: {
        all : {
            type : Number
        },
        renting: {
            type : Number
        },
    },
    available: {
        rental : {
            type : Boolean
        },
        return : {
            type : Boolean
        }
    },
    rentInfo:[{ type: mongoose.Schema.Types.ObjectId, ref:"Rent"}],
    createDate:{
        type : Date,
        required : true,
        default: new Date()
    },
    updateDate:{
        type : Date,
        required : true,
        default: new Date()
    },
    delete :{
        type : Boolean,
        default : false
    }
});

const Item = mongoose.model('Item', itemSchema); // userSchema를 model로 감싸준다.

module.exports = { Item }; // Item라는 모델을 본 파일 밖에서도 사용할 수 있도록 export 구문을 작성해준다.