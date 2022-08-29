const express = require('express'); // express 임포트
const app = express(); // app생성
const port = 3000;

const config = require('./config/key');

const bodyParser = require("body-parser"); //body-parser 사용

app.use(bodyParser.urlencoded({ extended: true })); //application/x-www-form-urlencoded 로 된 데이터를 분석해서 가져올 수 있게 한다
app.use(bodyParser.json()); //application/json 타입으로 된 데이터를 분석해서 가져올 수 있게 한다 -> json형식으로 파싱

app.listen(port, () => console.log(`${port}포트입니다.`));

// 몽구스 연결
const mongoose = require('mongoose');
mongoose
    .connect(config.mongoURI, {
        // useNewUrlPaser: true,
        // useUnifiedTofology: true,
        // useCreateIndex: true,
        // useFindAndModify: false,
    })
    .then(() => console.log('MongoDB conected'))
    .catch((err) => {
        console.log(err);
    });
