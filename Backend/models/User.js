const mongoose = require('mongoose'); // mongoose를 선언해주고,
const bcrypt = require('bcrypt')
const saltRounds = 10

/**
 * 담당자 : 강재민, 정희성
 * 함수 설명 : 유저정보 스키마
 * 기능 설명 : - 사용자명, 부서, 직급, 사번, 이메일, 비밀번호, 권한{대여, 편집, 열람, 관리자}로 구성
 */
const userSchema = mongoose.Schema({  // userSchema라는 이름의 schema를 작성해준다.
    name: {
        type: String,
        maxLength: 50,
        require: true,
        trim: true
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
        require: true,
        index: true
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

    }
});
/**
* 담당자 : 정희성
* 함수 내용 : 저장 전 비밀번호를 암호화해주는 함수
* 주요 기능 : save 미들웨어로 저장 전 실행되는 기능
 *          저장 시 비밀번호를 salt와 함께 hash 한 후 DB에 저장하는 기능
**/
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
    // 유저의 비밀번호가 생성된 경우
    if (user.isModified('password')) {
        //salt 10자리를 랜덤으로 생성(매번 다른 값)
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err);
            //랜덤으로 생성된 salt 값과 유저의 비밀번호를 hash 처리
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
/**
* 담당자 : 정희성
* 함수 내용 : 유저 비밀번호를 초기화 혹은 수정 시 암호화해주는 함수
* 주요 기능 : 유저가 초기화 혹은 수정을 위해 updateOne 사용 시 DB 저장 직전에 실행되는 기능
 *          유저의 수정된 비밀번호를 salt와 함께 hash하여 저장
**/
//유저 비밀번호 업데이트 시 암호화해주는 과정
userSchema.pre('updateOne', function (next) {
    const user =this;
    //유저의 비밀번호가 변경된 경우
    if (user.getUpdate().$set.password) {
        //salt 10자리를 생성
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err);
            //생성된 salt와 유저 비밀번호를 hash 처리
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
/**
* 담당자 : 정희성
* 함수 내용 : 암호화되어 저장된 비밀번호를 풀어서 로그인할 떄 입력한 비밀번호와 일치하는지 확인하는 함수
* 주요 기능 : bcrypt 의 compare 함수를 통해 해석하는 기능
 *           로그인 시 입력된 비밀번호와 일치하는지 확인하는 기능
**/
userSchema.methods.comparePassword = function (plainPassword, cb) {
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err) return cb(err)
        cb(null, isMatch)
    })
}

const User = mongoose.model('User', userSchema); // userSchema를 model로 감싸준다.

module.exports = { User }; // User라는 모델을 본 파일 밖에서도 사용할 수 있도록 export 구문을 작성해준다.
