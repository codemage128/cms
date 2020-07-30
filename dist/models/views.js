"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _mongoose = _interopRequireDefault(require("mongoose"));

var Schema = _mongoose["default"].Schema;
var viewsSchema = new Schema({
  day: String,
  week: String,
  month: String,
  year: String,
  date: String,
  viewerIp: String
}, {
  timestamps: true
});
module.exports = _mongoose["default"].model('Views', viewsSchema);