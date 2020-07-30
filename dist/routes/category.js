"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _category = _interopRequireDefault(require("../models/category"));

var _subcategory = _interopRequireDefault(require("../models/subcategory"));

var _articles = _interopRequireDefault(require("../models/articles"));

var _auth = _interopRequireDefault(require("../helpers/auth"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var router = _express["default"].Router(); // Create a new category


router.post('/category/create', _auth["default"], /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var exist, payload, category;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return _category["default"].find({
              name: req.body.name
            });

          case 3:
            exist = _context.sent;

            if (!(exist == '')) {
              _context.next = 10;
              break;
            }

            payload = {
              name: req.body.name.toLowerCase(),
              slug: !req.body.slug ? req.body.name.split(' ').join('-').toLowerCase() : req.body.slug.split(' ').join('-').toLowerCase(),
              description: req.body.description,
              background: req.body.background,
              color: req.body.color,
              parent: !req.body.parent ? undefined : req.body.parent
            };
            category = new _category["default"](payload);
            category.save().then(function (saved) {
              req.flash('success_msg', 'Category was created successfully');
              return res.redirect('back');
            })["catch"](function (e) {
              return next(e);
            });
            _context.next = 12;
            break;

          case 10:
            req.flash('success_msg', "There's a category with that name already");
            return _context.abrupt("return", res.redirect('back'));

          case 12:
            _context.next = 17;
            break;

          case 14:
            _context.prev = 14;
            _context.t0 = _context["catch"](0);
            next(_context.t0);

          case 17:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 14]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}()); // Edit a category

router.post('/category/edit', _auth["default"], function (req, res, next) {
  try {
    req.body.slug = !req.body.slug ? req.body.name.split(' ').join('-').toLowerCase() : req.body.slug.split(' ').join('-').toLowerCase();

    _category["default"].updateOne({
      _id: req.body.categoryId.trim()
    }, req.body).then(function (updated) {
      req.flash('success_msg', 'Category has been updated');
      return res.redirect('back');
    })["catch"](function (e) {
      return next(e);
    });
  } catch (error) {
    next(error);
  }
}); // Delete a category

router.post('/category/delete', _auth["default"], function (req, res, next) {
  try {
    _articles["default"].deleteMany({
      category: req.body.categoryId
    }).then(function (deleted) {
      _category["default"].deleteOne({
        _id: req.body.categoryId.trim()
      }).then(function (deleted) {
        req.flash('success_msg', 'Category has been deleted');
        return res.redirect('back');
      })["catch"](function (e) {
        return next(e);
      });
    })["catch"](function (e) {
      return next(e);
    });
  } catch (error) {
    next(error);
  }
}); // Delete many Categories

router.post('/category/deleteMany', _auth["default"], function (req, res, next) {
  try {
    _articles["default"].deleteMany({
      category: req.body.ids
    }).then(function (deleted) {
      _category["default"].deleteMany({
        _id: req.body.ids
      }).then(function (deleted) {
        req.flash('success_msg', 'Category has been Deleted');
        return res.redirect('back');
      })["catch"](function (e) {
        return next(e);
      });
    })["catch"](function (e) {
      return next(e);
    });
  } catch (error) {
    next(error);
  }
}); // Create a new SubCategory

router.post('/subcategory/create', _auth["default"], /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var exist, payload, subcategory;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return _category["default"].find({
              parent: {
                $ne: undefined
              },
              name: req.body.name
            });

          case 3:
            exist = _context2.sent;

            if (!(exist == '')) {
              _context2.next = 10;
              break;
            }

            payload = {
              name: req.body.name.toLowerCase(),
              slug: !req.body.slug ? req.body.name.split(' ').join('-').toLowerCase() : req.body.slug.split(' ').join('-').toLowerCase(),
              description: req.body.description,
              parent: req.body.parent
            };
            subcategory = new _category["default"](payload);
            subcategory.save().then(function (saved) {
              req.flash('success_msg', 'Sub Category was created successfully');
              return res.redirect('back');
            })["catch"](function (e) {
              return next(e);
            });
            _context2.next = 12;
            break;

          case 10:
            req.flash('success_msg', "There's a Category or Sub Category with that name already");
            return _context2.abrupt("return", res.redirect('back'));

          case 12:
            _context2.next = 17;
            break;

          case 14:
            _context2.prev = 14;
            _context2.t0 = _context2["catch"](0);
            next(_context2.t0);

          case 17:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 14]]);
  }));

  return function (_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}()); // Edit a Subcategory

router.post('/subcategory/edit', _auth["default"], function (req, res, next) {
  try {
    req.body.slug = !req.body.slug ? req.body.name.split(' ').join('-').toLowerCase() : req.body.slug.split(' ').join('-').toLowerCase();

    _category["default"].updateOne({
      _id: req.body.subcategoryId.trim()
    }, req.body).then(function (updated) {
      req.flash('success_msg', 'Sub Category has been updated');
      return res.redirect('back');
    })["catch"](function (e) {
      return next(e);
    });
  } catch (error) {
    next(error);
  }
}); // Delete a Sub category

router.post('/subcategory/delete', _auth["default"], function (req, res, next) {
  try {
    _articles["default"].deleteMany({
      subCategory: req.body.subcategoryId
    }).then(function (deleted) {
      _category["default"].deleteOne({
        _id: req.body.subcategoryId.trim()
      }).then(function (deleted) {
        req.flash('success_msg', 'Sub Category has been deleted');
        return res.redirect('back');
      })["catch"](function (e) {
        return next(e);
      });
    })["catch"](function (e) {
      return next(e);
    });
  } catch (error) {
    next(error);
  }
}); // Delete many Sub Categories

router.post('/subcategory/deleteMany', _auth["default"], function (req, res, next) {
  try {
    _articles["default"].deleteMany({
      subCategory: req.body.ids
    }).then(function (deleted) {
      _category["default"].deleteMany({
        _id: req.body.ids
      }).then(function (deleted) {
        req.flash('success_msg', 'Sub Category has been Deleted');
        return res.redirect('back');
      })["catch"](function (e) {
        return next(e);
      });
    })["catch"](function (e) {
      return next(e);
    });
  } catch (error) {
    next(error);
  }
}); // get some categories and send ti the client side

router.post('/get-sub-categories', _auth["default"], /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var data;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return _category["default"].aggregate([{
              $match: {
                _id: _mongoose["default"].Types.ObjectId(req.body.b)
              }
            }, {
              $lookup: {
                from: 'subcategories',
                localField: '_id',
                foreignField: 'parent',
                as: 'data'
              }
            }]);

          case 3:
            data = _context3.sent;
            res.send(data);
            _context3.next = 10;
            break;

          case 7:
            _context3.prev = 7;
            _context3.t0 = _context3["catch"](0);
            next(_context3.t0);

          case 10:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 7]]);
  }));

  return function (_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}());
module.exports = router;