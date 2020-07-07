// const User = require("./models/User");
const { User } = require("../models/User");

let auth = (req, res, next) => {

    // 인증 처리를 하는 곳

    // 클라이언트 쿠키에서 token을 가져온다 #13 9:20
    let token = req.cookies.x_auth;

    // token 을 복호화(decode)한 후 user 를 찾는다 
    // User.js 에 methods 생성
    User.findByToken(token, (err, user) => {
        if(err) throw err;
        if(!user) return res.json({ isAuth: false, error: true })
        
        // 유저가 있으면
        // req 에 token user 넣어주는 이유 #13 15:00
        req.token = token;
        req.user = user;
        next(); //middleware 니까 계속 function 될 수 있게
    })

    // user 가 있으면 인증 가능
    // user 가 없으면 인증 불가능
}


module.exports = { auth };
