var mongoose = require('mongoose');
var crypto = require('crypto');

mongoose.connect('mongodb://localhost:27017/AAA');

var mdb = mongoose.connection;

mdb.on('error', function(error) {
    console.log(error)
    console.log('Connection Failed!');
});

mdb.once('open', function () {
    console.log('Connection Success!');
});


var urlSchema = new mongoose.Schema({
    url: String,
    baseUrl: String,
    code: Number,
    title: String,
    visits: Number
});

var Link = mongoose.model('Urls', urlSchema);

var userSchema = new mongoose.Schema({
    username: { type: String, unique: true, index: true },
    password: String
});

var User = mongoose.model('Users', userSchema);



Link.methods = {
    shorten: function (url) {
        var shasum = crypto.createHash('sha1');
        shasum.update(url);
        var shortLink = shasum.digest('hex').slice(0, 5);
        return shortLink;
    }
};
// var urls = mongoose.Schema({
//     url: 'string',
//     baseUrl: 'string',
//     code: 'number',
//     title: 'string',
//     visits: 'number',
//     // timestamps : true
// });

// var users = mongoose.Schema({
//     username: {type :'string', unique : 'true', index:'true'},
//     password: 'string',
//     // timestamps: true
// });


// exports.url = mongoose.model('urls', urls);
// exports.user = mongoose.model('users', users);



// var newusers = new user({ username: 'Hong Gil Dong', password: '서울시 강남구 논현동' });

// newusers.save(function (error, data) {
//     if (error) {
//         console.log(error);
//     } else {
//         console.log('Saved!')
//     }
// });

// user.findOne({ username: 'Hong Gil Dong' }, function (error, user) {
//     console.log('--- Read one ---');
//     if (error) {
//         console.log(error);
//     } else {
//         console.log(user);
//     }
// });


// module.exports = mdb;


module.exports = { Link, User };
