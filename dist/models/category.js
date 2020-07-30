"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _mongoose = _interopRequireDefault(require("mongoose"));

var Schema = _mongoose["default"].Schema;
var categorySchema = new Schema({
  name: String,
  slug: String,
  description: String,
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  background: String,
  color: {
    type: String,
    "default": '#000000'
  }
}, {
  timestamps: true
});
module.exports = _mongoose["default"].model('Category', categorySchema);