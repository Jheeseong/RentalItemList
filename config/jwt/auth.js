const jwt = require('./jwt');
const cookie = require('cookie')
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

// 액세스 권한 인증
const authUtil = {
    checkToken: async (req, res, next) => {
        // const token = req.body.token;
        const token = req.headers.cookie;
        cookie.parse(token);
        console.log(cookie.serialize())
        if(!token)
            // 토큰 없음
            return res.json({code : "Token check fail", message : "TOKEN EMPTY"});

        // 토큰 해독
        const user = await jwt.verify(token);

        // 유효기간 만료
        if (user === TOKEN_EXPIRED)
            return res.json({code : "Token authorized fail", message : "TOKEN EXPIRED"});
        // 유효하지 않는 토큰
        if (user === TOKEN_INVALID)
            return res.json({code : "Token authorized fail", message : "TOKEN INVALID"});
        if (user.email === undefined)
            return res.json({code : "Token authorized fail", message : "TOKEN EXPIRED"});
        req.email = user.email;
        next();
    }
}

module.exports = authUtil;