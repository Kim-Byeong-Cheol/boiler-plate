const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const { User } = require('./models/User.js');

const config = require('./config/key.js');

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// application/json
app.use(bodyParser.json());

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});