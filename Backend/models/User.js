const mongoose = require('mongoose'); // mongoose를 선언해주고,
const bcrypt = require('bcrypt')
const saltRounds = 10

const userSchema = mongoose.Schema({  // userSchema라는 이름의 schema를 작성해준다.
    name: {
        type: String,
        maxLength: 50,
        require: true
    },
    department: {
        type: String,
    },
    role: {
        type: String,
    },
    workNumber: {
        type: Number,
        unique:true,
        require: true
    },
    email: {
        type: String,
        maxLength: 50,
        trim: true
        // space를 없애준다.
        // unique: 1
        // 같은값은 하나만 존재할 수 있다.
    },
    password: {
        type: String,
        minLength: 3,
        require:true
    },
    authority: {
        rentalAuthority: {
            type: Boolean,
            default:false
        },
        editAuthority:{
            type: Boolean,
            default:false
        },
        openAuthority:{
            type: Boolean,
            default:false
        },
        administrator:{
            type: Boolean,
            default:false
        }

    },
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
});
/*monggose pre 메소드를 사용해서 save 실행 전에 실행되도록 설계*/
userSchema.pre('save', function (next) {

    const user = this;

    /*암호화 종류
    * 1. SHA-2(secure Hash Algorithm2)
    * - GPU를 이용하여 연산속도가 빨라 password 암호화에는 비권장
    * - GPU 연산속도가 빠를수록 공격자의 하드웨어를 통한 오프라인에 더 취약
    * 2. PBKDF2(pbkdf2_hmac(해시함수(sha256..), password, salt, iteration, DLen))
    * - 해쉬함수의 컨테이너 역할
    * - 검증된 해시함수를 사용
    * - 해시함수와 salt 적용 후 해쉬 함수의 반복횟수를 지정하여 암호화
    * 3. Bcrypt(bcrypt.hashpw(password, bcrypt.gensalt()))
    * - Blowfish암호를 기반으로 설계된 암호화 함수
    * - salting과 key stretching을 구현한 함수로 단방향 암호화
    * - 반복횟수를 늘려 연삭속도 조절이 가능하여 brute-force 공격에 대비 가능
    * - 기존의 hashing은 동일한 입력 값에 동일한 출력 값을 가지는 문제가 있어 salt를 활용
    * - 실제 비밀번호(plain Text)에 salt라는 랜덤 값을 추가 후 hashing
    * - plain Text + salt -> hashing -> hashed Text
    * - ex) $[algorithm]$[cost]$[salt][hash]
    * - algorithm : bcrypt의 버전 정보
    * - cost : round 수를 의미, 클수록 연산 cost가 증가
    * - 나머지 salt와 hash 값
    * - compare 원리 : plain Text와 저장된 salt 정보를 가지고 bcrypt에 넣으면 hash 값 확인 가능
    *                 hash 값을 적절하게 조합하여 암호화되어 저장된 문자열과 비교하여 체크*/
    if (user.isModified('password')) {
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err);

            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err);
                user.password = hash;
                next();
            });
        });
    } else {
        next()
    }
});
//유저 비밀번호 업데이트 시 암호화해주는 과정
userSchema.pre('updateOne', function (next) {
    const user =this;
    if (user.getUpdate().$set.password) {
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err);

            bcrypt.hash(user.getUpdate().$set.password, salt, function (err, hash) {
                if (err) return next(err);
                user.getUpdate().$set.password = hash;
                next();
            });
        });
    } else {
        next()
    }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err) return cb(err)
        cb(null, isMatch)
    })
}

const User = mongoose.model('User', userSchema); // userSchema를 model로 감싸준다.

module.exports = { User }; // User라는 모델을 본 파일 밖에서도 사용할 수 있도록 export 구문을 작성해준다.


//
// userSchema.methods.comparePassword = function (plainPassword, cb) {
//     bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
//         if (err) return cb(err)
//             cb(null, isMatch)
//     })
// }
//
// userSchema.methods.generateToken = function (cb) {
//     const user = this;
//     //jsonWebToken 을 이용해서 token 생성
//     const token = jwt.sign(user._id.toString(), 'secretToken')
//
//     user.token = token
//     user.save(function (err, user) {
//         if (err) return cb(err)
//         cb(null, user)
//     })
// };
//
// userSchema.statics.findByToken = function (token, cb) {
//     const user = this;
//
//     //토큰을 decode 한다.
//     jwt.verify(token, "secretToken", function (err, decoded) {
//         //유저 아이디를 이용하여 유저를 찾은 다음
//         // 클라이언트에서 거져온 token과 db에 보관된 토큰 일치 여부 확인
//         user.findOne({ _id: decoded, token: token }, function (err, user) {
//             if (err) return cb(err);
//             cb(null, user);
//         });
//     });
// };