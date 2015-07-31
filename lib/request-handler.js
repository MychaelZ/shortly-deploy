var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var Users = require('../app/models/user');
var Links = require('../app/models/link');
// var Users = require('../app/collections/users');
// var Links = require('../app/collections/links');

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
  req.session.destroy(function(){
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Links.find({}, function (err, links) {
    res.send(200, links);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  Links.findOne({url: uri}, function (err, link) {
    if (link) {
      res.send(200, link);
    } else {
      util.getUrlTitle(uri, function (err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }

        var link = new Links({
          url: uri,
          title: title,
          base_url: req.headers.origin
        })
        .save(function (err, link) {
          if (err) {
            console.log('lol i failed');
            return res.send(500);
          }
          console.log('i werk')
          res.send(200, link);
        });
        
      });
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  Users.findOne({username: username}, function (err, user) {
    if (!user) {
      res.redirect('/login');
    } else {
      user.comparePassword(password, function(match) {
        if (match) {
          util.createSession(req, res, user);
        } else {
          res.redirect('/login');
        }
      });
    }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  Users.findOne({username: username}, function (err, user) {
    if (!user) {
      var newUser = new Users({
        username: username,
        password: password
      })
      .save(function (err, newUser) {
        util.createSession(req, res, newUser);
      });
    } else {
      console.log('Account already exists');
      res.redirect('/signup');      
    }
  });
};

exports.navToLink = function(req, res) {
  Links.findOne({code: req.params[0]}, function (err, link) {
    if (!link) {
      res.redirect('/');
    } else {
      link.vists.$inc();
      link.save(function (err) {
        res.redirect(link.url);
      });
    }
  });
};