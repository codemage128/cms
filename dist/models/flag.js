"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var Schema = _mongoose["default"].Schema;
var flagSchema = new Schema({
  articleId: {
    type: Schema.Types.ObjectId,
    ref: "Article"
  },
  reason: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
}, {
  timestamps: true
});

var _default = _mongoose["default"].model("Flag", flagSchema);

exports["default"] = _default;