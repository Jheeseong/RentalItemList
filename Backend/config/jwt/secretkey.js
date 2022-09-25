/**
 * 담당자 : 강재민
 * 함수 설명 : 토큰 암호화 키
 * 기능 설명 : - 토큰 발급시 사용되는 키 입니다.
 */
module.exports = {
    secretKey : "BeautyAndTheBeast",
    option : {
        algorithm : "HS256",
        expiresIn : "120m",
        issuer : "admin"
    }
}