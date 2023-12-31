const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const moment = require('moment');
const jwt = require("jsonwebtoken");

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
        type: Number,
        default: 0
    },
    image: {
        type: String
    },
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
});

userSchema.pre("save", function (next) {
    // save 함수가 실행되거전에 무엇을 한다는 의미
    let user = this;

    if (user.isModified("password")) {
        bcrypt.genSalt(saltRounds)
        .then(result => { 
            return bcrypt.hash(user.password, result)
        })
        .then(hash => {
            user.password = hash;
            next();
        })
        .catch(err => {
            next(err);
        });
    } else {
        next();
    }
});

userSchema.methods.comparePassword = function (planePassword, cb) {
    bcrypt.compare(planePassword, this.password)
    .then(isMatch => { cb(null, isMatch); })
    .catch(err => { return cb(err, null); });
};

userSchema.methods.generateToken = function (cb) {
    let user = this;
    // jsonwebtoken을 이용해서 토큰을 생성하기
    let token = jwt.sign(user._id.toHexString(), "secretToken");
    let oneHour = moment().add(1, "hour").valueOf();

    user.token = token;
    user.tokenExp = oneHour;
    user.save()
    .then(user => { cb(null, user) })
    .catch(err => { return cb(err) })
};

userSchema.statics.findByToken = function (token, cb) {
    let user = this;

    // 토큰을 decode 한다.
    jwt.verify(token, 'secretToken', function (err, decoded) {
        user.findOne({ "_id": decoded, "token": token })
        .then(user => { cb(null, user); })
        .catch(err => { cb(err); });
    });
};

const User = mongoose.model('User', userSchema);
module.exports = { User };
