if (process.env.MODE_ENV === 'production') {
    module.exports = require('./prod.js');
} else {
    module.exports = require('./dev.js');
}