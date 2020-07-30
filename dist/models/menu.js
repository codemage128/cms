"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _mongoose = _interopRequireDefault(require("mongoose"));

var Schema = _mongoose["default"].Schema;
var menuSchema = new Schema({
  name: String,
  type: String,
  link: String,
  position: Number
}, {
  timestamps: true
});
module.exports = _mongoose["default"].model("Menu", menuSchema);