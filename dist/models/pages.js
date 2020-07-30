"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _mongoose = _interopRequireDefault(require("mongoose"));

var Schema = _mongoose["default"].Schema;
var pageSchema = new Schema({
  name: String,
  content: String,
  featuredImage: String,
  status: {
    type: String,
    "enum": ['published', 'draft']
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  slug: String,
  location: {
    type: String,
    "enum": ['top-menu', 'main-menu', 'footer']
  },
  position: {
    type: String,
    "enum": ['right', 'left']
  }
}, {
  timestamps: true
});
module.exports = _mongoose["default"].model('Pages', pageSchema);