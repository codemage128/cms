"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _mongoose = _interopRequireDefault(require("mongoose"));

var Schema = _mongoose["default"].Schema;
var announcementSchema = new Schema({
  title: String,
  body: String,
  type: {
    type: String,
    "enum": ['success', 'warning', 'danger']
  },
  active: {
    type: Boolean,
    "default": true
  }
}, {
  timestamps: true
});
module.exports = _mongoose["default"].model('Announcement', announcementSchema);