var mongoose = require('mongoose');


var userSchema = new mongoose.Schema({
  username: { type: String, unique: true, index: true },
  password: String
});

var User = mongoose.model('Users', userSchema);

module.exports = User;