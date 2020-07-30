"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var Schema = _mongoose["default"].Schema;
var bookmarkSchema = new Schema({
  articleId: {
    type: Schema.Types.ObjectId,
    ref: "Article"
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
}, {
  timestamps: true
});

var _default = _mongoose["default"].model("Bookmark", bookmarkSchema);

exports["default"] = _default;