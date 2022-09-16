const mongoose = require('mongoose'); // mongoose를 선언해주고,


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
    },
    number: {
        type: Number,
    },
    code: {
        type: String,
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
    delete :{
        type : Boolean,
        default : false
    }
});

const Item = mongoose.model('Item', itemSchema); // userSchema를 model로 감싸준다.

module.exports = { Item }; // Item라는 모델을 본 파일 밖에서도 사용할 수 있도록 export 구문을 작성해준다.