"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _menu2 = _interopRequireDefault(require("../models/menu"));

var _auth = _interopRequireDefault(require("../helpers/auth"));

var _role = _interopRequireDefault(require("../helpers/role"));

var router = _express["default"].Router(); // Create a new menu


router.post("/menu/create", _auth["default"], (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var menu, error;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _menu2["default"].countDocuments();

          case 2:
            menu = _context.sent;
            req.assert("name", "Menu name field cannot be blank").notEmpty();
            req.assert("type", "Pls choose a menu type").notEmpty();
            error = req.validationErrors();

            if (!error) {
              _context.next = 9;
              break;
            }

            req.flash("success_msg", error[0].msg);
            return _context.abrupt("return", res.redirect("back"));

          case 9:
            req.body.position = menu + 1;
            _context.next = 12;
            return _menu2["default"].create(req.body);

          case 12:
            req.flash("success_msg", "Menu created Successfully");
            return _context.abrupt("return", res.redirect("back"));

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}()); // edit a menu

router.post("/menu/edit", _auth["default"], (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var menu;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return _menu2["default"].find({
              _id: req.body.menuId
            });

          case 2:
            menu = _context3.sent;
            menu.map( /*#__PURE__*/function () {
              var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(_menu) {
                var payload;
                return _regenerator["default"].wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        payload = {
                          position: req.body["item[".concat(_menu._id, "][position]")],
                          link: req.body["item[".concat(_menu._id, "][link]")],
                          type: req.body["item[".concat(_menu._id, "][type]")],
                          name: req.body["item[".concat(_menu._id, "][name]")]
                        };
                        _context2.next = 3;
                        return _menu2["default"].updateOne({
                          _id: _menu._id
                        }, payload);

                      case 3:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              }));

              return function (_x7) {
                return _ref3.apply(this, arguments);
              };
            }());
            req.flash("success_msg", "Menu updated successfully");
            return _context3.abrupt("return", res.redirect("back"));

          case 6:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}()); // Delete a menu

router.post("/menu/delete", _auth["default"], (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return _menu2["default"].deleteOne({
              _id: req.body.id
            });

          case 2:
            res.status(200).send("Menu has been deleted.");

          case 3:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function (_x8, _x9, _x10) {
    return _ref4.apply(this, arguments);
  };
}());
module.exports = router;