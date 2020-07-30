"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _bookmark = _interopRequireDefault(require("../models/bookmark"));

var _auth = _interopRequireDefault(require("../helpers/auth"));

var router = _express["default"].Router(); // Add a new article to reading list


router.get("/bookmark/create", _auth["default"], /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var check;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _bookmark["default"].findOne({
              articleId: req.query.articleId,
              userId: req.user.id
            });

          case 2:
            check = _context.sent;

            if (!check) {
              _context.next = 6;
              break;
            }

            req.flash("success_msg", "Article already exist in your reading list");
            return _context.abrupt("return", res.redirect("back"));

          case 6:
            _context.next = 8;
            return _bookmark["default"].create({
              articleId: req.query.articleId,
              userId: req.user.id
            });

          case 8:
            req.flash("success_msg", "Article has been added to reading list");
            return _context.abrupt("return", res.redirect("back"));

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}()); // Remove an article from reading list

router.get("/bookmark/delete", _auth["default"], /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _bookmark["default"].deleteOne({
              _id: req.query.bookmarkId
            });

          case 2:
            req.flash("success_msg", "Article has been removed from reading list");
            return _context2.abrupt("return", res.redirect("back"));

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}());
var _default = router;
exports["default"] = _default;