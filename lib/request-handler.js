var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');
var mongoose = require('mongoose');

// var mdb = require('../app/server');
// var User = require('../app/models/user');
// var Link = require('../app/models/link');
// var Users =  require('../app/collections/users');
// var Links = require('../app/collections/links');
var User = require('../app/server').User;
var Link = require('../app/server').Link;
// var Url = require('../app/models/mongolink');



exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.find().then(function(links) {
    res.status(200).send(links);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.sendStatus(404);
  }
  console.log('Link :', Link);
  console.log('Link.methods : ', Link.methods)
  Link.findOne({ url: uri }).then(function(found) {
    if (found) {
      res.status(200).send(found);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.sendStatus(404);
        }
        var newLink = new Link({
          url: uri,
          title: title,
          baseUrl: req.headers.origin
        });
        console.log(newLink);
        newLink.code = Link.methods.shorten(uri);
        newLink.save().then(function() {
          res.status(200).send(newLink);
        });
      });
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username}, function (error, users) {
    if (error) {
      console.log(error);
    } else if(!users) {
      res.send('<script type="text/javascript">alert("아이디와 비밀번호를 확인하세요");</script><a href = "/login">로그인페이지로</a>');
    } else {
      bcrypt.compare(password, users.password, function (err, result) {
        if (err) {throw err;}
        else {
      util.createSession(req, res, users);
        }
      })
    }
  })
};


exports.signupUser = function(req, res) {
  console.log(req.body);
  var username = req.body.username;
  var password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

  User.findOne({ username: username}, function (error, users) {
    if (error) {
      console.log(error);
    } else if (!users){
      var newUser = new User({ username: username, password: password});
      newUser.save();
      res.redirect('/login')
    } else {
      res.send('<script type="text/javascript">alert("이미 존재하는 아이디");</script><a href = "/signup">회원가입페이지로</a>'); 
    }
  });
};

exports.navToLink = function(req, res) {
  Link.findOne({ code: req.params[0] }).then(function(link) {
    if (!link) {
      res.redirect('/');
    } else {
      link.visits++;
      link.save()
        .then(function() {
          return res.redirect(link.url);
        });
    }
  });
};