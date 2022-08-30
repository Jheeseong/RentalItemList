const express = require('express');
const {User} = require("../models/User");
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/register", (req, res) => {
  const user = new User(req.body);
  user.save((err, userInfo) => {
    console.log("DB 저장 완료!")
    //MongoDB에서 오는 Method, 정보들이 User model에 저장
    //저장 할 때 err가 있다면 client에 err가 있다고 전달 -> 전달을 할 때 json 형식으로 전달
    if (err) return res.json({ success: false, err })
    // 성공했을시에는 status 200 -> json 형식으로 정보 전달
    return res.status(200).json({
      success: true,
      userInfo,
    })
  })
})

module.exports = router;
