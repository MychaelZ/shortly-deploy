var mongoose = require('mongoose');
var db = require('../config');
var crypto = require('crypto');

var Link = mongoose.model('Link', db.linkSchema);

module.exports = Link;
