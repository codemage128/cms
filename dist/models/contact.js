"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _mongoose = _interopRequireDefault(require("mongoose"));

var Schema = _mongoose["default"].Schema;
var contactSchema = new Schema({
  fullname: String,
  email: String,
  number: Number,
  help: String,
  message: String
}, {
  timestamps: true
});
module.exports = _mongoose["default"].model('Contact', contactSchema);