const mongoose = require('mongoose'); // mongoose를 선언해주고,

/**
 * 담당자 : 강재민, 정희성
 * 함수 설명 : 대여이력 스키마
 * 기능 설명 : - 대여상태, 대여자명, 대여자사번, 물품코드, 대여목적, 대여일, 반납예정일, 반납일, 대여한물품정보(물품_id로 매핑), 유저정보(유저_id로 매핑)
 *              - 물품 정보가 item의 _id로 mongoose를 이용해 매핑되어있습니다.
 *              - 대여자 정보가 user의 _id로 mongoose를 이용해 매핑되어있습니다.
 */
const rentSchema = mongoose.Schema({  // userSchema라는 이름의 schema를 작성해준다.
    /*대여 상태*/
    rentStatus: {
        type: Boolean
    },
    /*대여자*/
    userName: {
        type: String
    },
    /*대여자 사번*/
    workNumber: {
        type: Number
    },
    /*물품 코드*/
    itemCode: {
        type: String
    },
    /*대여 목적*/
    purpose: {
        type: String
    },
    /*대여일*/
    rentDate: {
        type: Date,
    },
    /*반납 예정일*/
    returnPlanDate: {
        type: Date
    },
    /*반납 일*/
    returnDate: {
        type: Date
    },
    itemInfo: { type: mongoose.Schema.Types.ObjectId, ref:"Item"},
    userInfo: { type: mongoose.Schema.Types.ObjectId, ref:"User"}


});

const Rent = mongoose.model('Rent', rentSchema); // userSchema를 model로 감싸준다.

module.exports = { Rent }; // Item라는 모델을 본 파일 밖에서도 사용할 수 있도록 export 구문을 작성해준다.