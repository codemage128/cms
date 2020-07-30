"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _mongoose = _interopRequireDefault(require("mongoose"));

var Schema = _mongoose["default"].Schema;
var commentSchema = new Schema({
  slug: String,
  name: String,
  email: String,
  website: String,
  comment: String,
  active: {
    type: Boolean,
    "default": false
  },
  replies: [{
    commentId: {
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    },
    name: String,
    email: String,
    reply: String,
    profilePicture: String,
    createdAt: {
      type: Date,
      "default": Date.now()
    }
  }],
  ip: String,
  articleId: {
    type: Schema.Types.ObjectId,
    ref: 'Article'
  },
  profilePicture: {
    type: String
  }
}, {
  timestamps: true
});
module.exports = _mongoose["default"].model('Comment', commentSchema);