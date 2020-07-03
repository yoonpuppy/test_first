const mongoose = require('mongoose');

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

//Schema를 Model로 감싸준다
//(model의 이름, Schema 이름)
const User = mongoose.model('User', userSchema)

//model을 다른 파일에서도 쓸 수 있게
module.exports = { User }
