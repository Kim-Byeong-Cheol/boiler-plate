const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')

const config = require('./config/key.js');

const { User } = require('./models/User.js');

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// application/json
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected!!'))
.catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.post('/register', (req, res) => {
  //
  const user = new User(req.body);
  // user.save((err, userInfo) => {
  //   if(err) return res.json({ success: false, err });
  //   return res.status(200).json({ success: true });
  // });
  user.save()
  .then(result => {
    res.status(200).json({ success: true });
  })
  .catch(err => {
    res.json({ success: false, error: err });
  });
});

app.post('/login', (req, res) => {
  // 요청된 이메일을 데이터베이스에서 찾는다.
  User.findOne( { email: req.body.email })
  .then(user => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      });
    } else {
      // 요청된 이메일이 데이터베이스에 있다면 비밀번호가 같은지 확인.
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (!isMatch)
          return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." });

        // 비밀번호 까지 맞다면 토큰을 생성하기 
        user.generateToken((err, userinfo) => {
          if (err) return res.status(400).send(err);

          // 토큰을 저장한다.
          res.cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userID: user._id });
        });        
      });
    }
  })
  .catch(err => {
    return err;
  });

  // 요청된 이메일이 데이터베이스에 있다면 비밀번호가 같은지 확인.
  

  // 비밀번호 까지 맞다면 토큰을 생성하기 
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});