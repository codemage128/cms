"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _mongoose = _interopRequireDefault(require("mongoose"));

var Schema = _mongoose["default"].Schema;
var subCategorySchema = new Schema({
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  name: String,
  slug: String,
  description: String
}, {
  timestamps: true
});
module.exports = _mongoose["default"].model('SubCategory', subCategorySchema);