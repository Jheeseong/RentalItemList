const express = require('express'); // express 임포트
const app = express(); // app생성
const port = 3000;
const path = require('path');

const { User } = require('./models/User');

const config = require('./config/MongoDB/key');
const bodyParser = require("body-parser"); //body-parser 사용
app.use(bodyParser.urlencoded({ extended: true })); //application/x-www-form-urlencoded 로 된 데이터를 분석해서 가져올 수 있게 한다
app.use(bodyParser.json()); //application/json 타입으로 된 데이터를 분석해서 가져올 수 있게 한다 -> json형식으로 파싱
app.listen(port, () => console.log(`${port}포트입니다.`));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 몽구스 연결
const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
        // useNewUrlPaser: true,
        // useUnifiedTofology: true,
        // useCreateIndex: true,
        // useFindAndModify: false,
    })
    .then(() => console.log('MongoDB conected'))
    .catch((err) => {
        console.log(err);
    });

// app.get('/', function (req, res) {
//     res.send('hello world!!');
// });

// router 연결
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/Login');


app.use("/", indexRouter);
app.use("/api/users", usersRouter);
app.use("/login", loginRouter)
