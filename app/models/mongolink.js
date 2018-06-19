var mongoose = require('mongoose');

var urlSchema = new mongoose.Schema({
  url: String,
  baseUrl: String,
  code: Number,
  title: String,
  visits: Number
    // timestamps : true
});

var Url = mongoose.model('Urls', urlSchema);



module.exports = Url;