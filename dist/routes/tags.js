"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _tags = _interopRequireDefault(require("../models/tags"));

var _auth = _interopRequireDefault(require("../helpers/auth"));

var _articles = _interopRequireDefault(require("../models/articles"));

var router = _express["default"].Router(); // Create a new tag


router.post('/tags/create', _auth["default"], /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var exist, payload, tag;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return _tags["default"].find({
              name: req.body.name
            });

          case 3:
            exist = _context.sent;

            if (!(exist == '')) {
              _context.next = 11;
              break;
            }

            req.body.slug = !req.body.slug ? req.body.name.split(' ').join('-').toLowerCase() : req.body.slug.split(' ').join('-').toLowerCase();
            payload = {
              name: req.body.name.toLowerCase(),
              slug: req.body.slug,
              description: req.body.description
            };
            tag = new _tags["default"](payload);
            tag.save().then(function (saved) {
              req.flash('success_msg', 'Tag was created successfully');
              return res.redirect('back');
            })["catch"](function (e) {
              return next(e);
            });
            _context.next = 13;
            break;

          case 11:
            req.flash('success_msg', "There's a Tag with that name already");
            return _context.abrupt("return", res.redirect('back'));

          case 13:
            _context.next = 18;
            break;

          case 15:
            _context.prev = 15;
            _context.t0 = _context["catch"](0);
            next(_context.t0);

          case 18:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 15]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}()); // Edit a tag

router.post('/tags/edit', _auth["default"], function (req, res, next) {
  try {
    _tags["default"].updateOne({
      _id: req.body.tagId.trim()
    }, req.body).then(function (updated) {
      req.flash('success_msg', 'Tag has been updated');
      return res.redirect('back');
    })["catch"](function (e) {
      return next(e);
    });
  } catch (error) {
    next(error);
  }
}); // Delete a tag

router.post('/tags/delete', _auth["default"], function (req, res, next) {
  try {
    _tags["default"].deleteOne({
      _id: req.body.tagId.trim()
    }).then(function (deleted) {
      req.flash('success_msg', 'Tag has been deleted');
      return res.redirect('back');
    })["catch"](function (e) {
      return next(e);
    });
  } catch (error) {
    next(error);
  }
}); // Delete many Tags

router.post('/tags/deleteMany', _auth["default"], function (req, res, next) {
  try {
    _tags["default"].deleteMany({
      _id: req.body.ids
    }).then(function (deleted) {
      req.flash('success_msg', 'Tags has been Deleted');
      return res.redirect('back');
    })["catch"](function (e) {
      return next(e);
    });
  } catch (error) {
    next(error);
  }
}); // Get tags page

router.get('/tags/:tag', /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var perPage, page, post, count, popular;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            perPage = 9;
            page = req.query.page || 1;
            _context2.next = 4;
            return _articles["default"].find({
              tags: {
                $regex: req.params.tag,
                $options: '$i'
              }
            }).populate('category').populate('postedBy').skip(perPage * page - perPage).limit(perPage).sort({
              createdAt: -1
            });

          case 4:
            post = _context2.sent;
            _context2.next = 7;
            return _articles["default"].countDocuments({
              tags: {
                $regex: req.params.tag,
                $options: '$i'
              }
            });

          case 7:
            count = _context2.sent;
            _context2.next = 10;
            return _articles["default"].find({
              tags: {
                $regex: req.params.tag,
                $options: '$i'
              }
            }).populate('category').populate('postedBy').skip(perPage * page - perPage).limit(perPage).sort({
              views: -1
            });

          case 10:
            popular = _context2.sent;
            res.render('tags', {
              title: req.params.tag,
              cat: req.params.tag,
              post: post,
              current: page,
              pages: Math.ceil(count / perPage),
              popular: popular
            });

          case 12:
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
module.exports = router;