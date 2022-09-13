const express = require('express'); // express 임포트
const app = express(); // app생성
const port = 3000;
const path = require('path');
const cookieParser = require('cookie-parser')

const { User } = require('./Backend/models/User');

const config = require('./Backend/config/MongoDB/key');
const bodyParser = require("body-parser"); //body-parser 사용
app.use(bodyParser.urlencoded({ extended: true })); //application/x-www-form-urlencoded 로 된 데이터를 분석해서 가져올 수 있게 한다
app.use(bodyParser.json()); //application/json 타입으로 된 데이터를 분석해서 가져올 수 있게 한다 -> json형식으로 파싱
app.use('/', express.static("./Frontend/public"))
app.use(cookieParser())

app.listen(port, () => console.log(`${port}포트입니다.`));

// view engine setup
app.set('views', path.join('Frontend', 'views'));
app.set('view engine', 'ejs');

// 몽구스 연결
const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
        dbName:'test',
        authMechanism:'DEFAULT',
        // useNewUrlPaser: true,
        // useUnifiedTofology: true,
        // useCreateIndex: true,
        // useFindAndModify: false,
    })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => {
        console.log(err);
    });

// app.get('/', function (req, res) {
//     res.send('hello world!!');
// });

// router 연결
const indexRouter = require('./Backend/routes/index');
const usersRouter = require('./Backend/routes/users');
const loginRouter = require('./Backend/routes/Login');
const signUpRouter = require('./Backend/routes/signUp');
const itemManagement = require('./Backend/routes/ItemManagement');
const createItem = require('./Backend/routes/createItem');
const rentItem = require('./Backend/routes/rentItem');
const myRental = require('./Backend/routes/myRental');

app.use("/", indexRouter);
app.use("/api/users", usersRouter);
app.use("/login", loginRouter);
app.use("/signUp", signUpRouter);
app.use("/createItem", createItem);
app.use("/itemmanagement", itemManagement);
app.use("/rentItem", rentItem);
app.use("/myRental", myRental);

