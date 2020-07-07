const express = require('express')
const app = express()
const bodyParser = require('body-parser'); // #11
const cookieParser = require('cookie-parser'); // #12
const { auth } = require('../server/middleware/auth'); // #13
const { User } = require("../server/models/User");

//데이터를 분석해서 가지고 올 수 있게 해줌
//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

//application/json
//json type 으로 된 걸 가지고 올 수 있게 해줌
app.use(bodyParser.json());
// #12 8:15 
app.use(cookieParser());

// #3 4:30
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://chdpark:abcd1234@chdpark.cqwy1.mongodb.net/<dbname>?retryWrites=true&w=majority', {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))


app.get('/', (req, res) => res.send('Hello World! love you jae'))

// #21
app.get('/api/hello', (req, res) => res.send('I love dw more than me'))

//register route
app.post('/api/users/register', (req, res) => {
  //회원가입 할 때 필요한 정보들을 client에서 가져오면
  //그것들을 데이터베이스에 넣어준다
  //<모든 정보를 model에 넣어준다>
    // #7 6:50 
  const user = new User(req.body)

  //save 하기 전에 암호화 시켜야 함 #10 bcrypt
  //User.js modified
  
  //mongoDB method
  user.save((err, doc) => {
    if(err) return res.json({ success: false, err })
    return res.status(200).json({
      success: true
    })
  })
})

// #11 login route
app.post('/api/users/login', (req, res) => {

  //DB에서 요청된 email 찾기 #11 3:15
  //요청된 email을 DB에서 있는지 찾는다
  User.findOne({ email: req.body.email }, (err, user) => {
    if(!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }

    // #11 6:00
    //요청된 이메일이 DB에 있다면 PASSWORD가 맞는지 확인    
    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch)
        return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." })

      //PASSWORD 까지 맞다면 TOKEN을 생성
      // #11 9:50 
      user.generateToken((err, user) => {
        // #12 5:00
        if(err) return res.status(400).send(err);

        // #12 6:00
        // token 을 저장. <쿠키, 로컬스토리지> 
        res.cookie("x_auth", user.token).status(200).json({ loginSuccess: true, userId: user._id })

      })
    })
  })
})

// user, product, comment 같은 router 들을 index 에만 놔두면 길어질 것이기 때문에
// /api/users/ < 이거 해서 구분해주면 좋음

// #13 Auth route < 관리자/일반 구분>
// #13 6:00
app.get('/api/users/auth', auth, (req, res) => {

  // 여기까지 middleware 를 통과해왔다는 건 Authentication 이 True 라는 말임
  // True 는 클라이언트에 정보를 전달해줘야 함 
  // User 정보에서 원하는 것만 전달해주면 됨 #13 17:00
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true, // #13 18:00
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })

})

// #14 logout route
// 로그아웃 하려는 유저를 DB 에서 찾아서
// 그 유저의 토큰을 지워주면 됨 2:10
app.get('/api/users/logout', auth, (req, res) => {
  
  User.findOneAndUpdate({ _id: req.user._id }, {token: ""},
  (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true
    })
  })
})

const port = 5000
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
