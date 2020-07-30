"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _mongoose = _interopRequireDefault(require("mongoose"));

var Schema = _mongoose["default"].Schema;
var newsletterSchema = new Schema({
  email: String,
  firstname: String,
  lastname: String,
  newsletterType: {
    type: String,
    "enum": ["daily", "weekly", "monthly"],
    "default": "weekly"
  }
}, {
  timestamps: true
});
module.exports = _mongoose["default"].model("Newsletter", newsletterSchema);