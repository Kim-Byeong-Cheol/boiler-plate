const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

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
            bcrypt.hash(user.password, result)
            .then(hash => {
                user.password = hash;
                next();
            })
            .catch(err => {
                return next(err);
            });
        })
        .catch(err => {
            return next(err);
        });
    }
});

const User = mongoose.model('User', userSchema);
module.exports = { User };
