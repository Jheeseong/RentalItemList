const randtoken = require('rand-token');
const jwt = require('jsonwebtoken');
const secretKey = require('./secretkey').secretKey;
const options = require('./secretkey').option;
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

module.exports = {
    /**
     * 담당자 : 강재민
     * 함수 설명 : 토큰 발급
     * 기능 설명 : - 물품 삭제 시 해당 물품의 delete 컬럼을 false로 변경해주었습니다.
     *              - 물품이 삭제되어도 대여이력에서의 물품정보는 남아있어야 하기 때문에, 물품을 완전히 삭제하기보다는 물품정보는 그대로 남겨놓는 방법을 선택하였습니다.
     */
    sign: async (user) => {
        const payload = {
                workNumber: user.workNumber,
                name: user.name,
                authority : user.authority,
                user_id: user._id
        };
        const result = {
            token: jwt.sign(payload, secretKey, options),
            refreshToken: randtoken.uid(256)
        };
        return result;
    },
    /**
     * 담당자 : 강재민
     * 함수 설명 : 토큰 검증
     * 기능 설명 : - 토큰을 해독하여 토큰에 문제가 없을 시 payload 값을 return 합니다.
     *              - 유효기간이 만료돼었거나 유효하지않은 토큰일 시에는 오류코드를 return합니다.
     */
    verify: async (token) => {
        let decoded;
        try {
            decoded = jwt.verify(token, secretKey);
        } catch (err) {
            if (err.message === 'jwt expired') {
                console.log('expired token');
                return TOKEN_EXPIRED;
            } else if (err.message === 'invalid token') {
                console.log('invalid token');
                console.log(TOKEN_INVALID);
                return TOKEN_INVALID;
            } else {
                console.log("invalid token");
                return TOKEN_INVALID;
            }
        }
        return decoded;
    }
}