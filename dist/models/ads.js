"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _mongoose = _interopRequireDefault(require("mongoose"));

var Schema = _mongoose["default"].Schema;
var adsSchema = new Schema({
  fileName: String,
  fileType: String,
  fileSize: Number,
  url: String,
  adCode: String,
  location: String
}, {
  timestamps: true
});
module.exports = _mongoose["default"].model('Ads', adsSchema);