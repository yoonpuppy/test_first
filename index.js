const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const { User } = require("./models/User");

//데이터를 분석해서 가지고 올 수 있게 해줌
//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

//application/json
//json type 으로 된 걸 가지고 올 수 있게 해줌
app.use(bodyParser.json());

// #3 4:30
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://chdpark:abcd1234@chdpark.cqwy1.mongodb.net/<dbname>?retryWrites=true&w=majority', {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))


app.get('/', (req, res) => res.send('Hello World! love you jae'))

//register route
app.post('/register', (req, res) => {
  //회원가입 할 때 필요한 정보들을 client에서 가져오면
  //그것들을 데이터베이스에 넣어준다
  //<모든 정보를 model에 넣어준다>
    // #7 6:50 
  const user = new User(req.body)

  //save 하기 전에 암호화 시켜야 함 #10 bcrypt
  //User.js modified
  
  //1:13

  //mongoDB method
  user.save((err, doc) => {
    if(err) return res.json({ success: false, err })
    return res.status(200).json({
      success: true
    })
  })

})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
