"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var Schema = _mongoose["default"].Schema;
var inSchema = new Schema({
  yes: {
    type: Boolean,
    "default": false
  }
}, {
  timestamps: true
});

var _default = _mongoose["default"].model('In', inSchema);

exports["default"] = _default;