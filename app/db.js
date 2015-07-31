var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// var port = process.env.ENV_NODE;

var linkSchema = new Schema({
  url: String,
  base_url: String,
  code: String,
  title: String,
  visits: Number,
  date: { type: Date, default: Date.now }
});

var userSchema = new Schema({
  username: String,
  password: String,
  date: { type: Date, default: Date.now }
});

mongoose.connect('mongodb://localhost:4568');

module.exports.Link = linkSchema
