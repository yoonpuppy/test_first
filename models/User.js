const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
//salt를 이용해서 암호화 #10 4:00
//saltRounds는 salt가 몇글자인지
const saltRounds = 10


// #4 2:42
const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number, //1이면 관리자, 2면 유저
        default: 0 //지정하지 않으면 role로 0을 주겠다
    },
    image: String, //object 사용하지 않고 string만 줌
    token: {
        type: String
    },
    tokenExp: { //token 유효기간, 사용할 수 있는 기간
        type: Number
    }
})

//register route 에서 save 하기 전에 암호화 시켜야 함
//user 정보를 저장하기 전에 function 한다 #10 2:30
userSchema.pre('save', function( next ){
    var user = this; //userSchema 를 가리킴

    //비밀번호를 바꿀 때에만 암호화 하기 위해서 조건을 걸어야 함
    //field 중에 password 가 변환될 때만 bcrypt를 이용해서 비밀번호를 암호화해준다 는 뜻
    if(user.isModified('password'))

    // #10 3:30
    //비밀번호 암호화 시키기 (bcrypt)
    bcrypt.genSalt(saltRounds, function(err, salt){
        if(err) return next(err) //err가 나면 save로 바로 보냄
        
        //제대로 가져오면 #10 7:00
        bcrypt.hash(user.password, salt, function(err, hash) {
            if(err) return next(err)

            //hash(암호화 된 비밀번호) 만들기 성공 시
            user.password = hash

            //할 거 다 하고 next 로 index.js save 로 보냄
            next()
        })
    })

})

//Schema를 Model로 감싸준다
//(model의 이름, Schema 이름)
const User = mongoose.model('User', userSchema)

//model을 다른 파일에서도 쓸 수 있게
module.exports = { User }
