"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _pages = _interopRequireDefault(require("../models/pages"));

var _auth = _interopRequireDefault(require("../helpers/auth"));

var router = _express["default"].Router(); // Create a page


router.post("/pages/create", _auth["default"], /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var error, exist, payload;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            req.assert("name", "Page Name Cannot be Blank").notEmpty();
            req.assert("content", "Page Content Cannot be Blank").notEmpty();
            error = req.validationErrors();

            if (!error) {
              _context.next = 9;
              break;
            }

            req.flash("success_msg", "".concat(error[0].msg));
            return _context.abrupt("return", res.redirect("back"));

          case 9:
            _context.next = 11;
            return _pages["default"].find({
              name: {
                $regex: req.body.name
              }
            });

          case 11:
            exist = _context.sent;

            if (!(exist == "")) {
              _context.next = 17;
              break;
            }

            payload = {
              name: req.body.name.trim(),
              content: req.body.content.trim(),
              featuredImage: req.body.featuredImage,
              status: !req.body.status ? "published" : req.body.status,
              author: req.user.id,
              slug: req.body.name.trim().toLowerCase().split(" ").join("-"),
              location: !req.body.location ? "main-menu" : req.body.location,
              position: !req.body.position ? "right" : req.body.position
            };

            _pages["default"].create(payload).then(function (created) {
              req.flash("success_msg", "Page Created Successfully");
              return res.redirect("back");
            })["catch"](function (e) {
              return next(e);
            });

            _context.next = 19;
            break;

          case 17:
            req.flash("success_msg", "There's a Page with That name");
            return _context.abrupt("return", res.redirect("back"));

          case 19:
            _context.next = 24;
            break;

          case 21:
            _context.prev = 21;
            _context.t0 = _context["catch"](0);
            next(_context.t0);

          case 24:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 21]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}()); // Edit a page

router.post("/pages/edit", _auth["default"], function (req, res, next) {
  try {
    req.assert("name", "Page Name Cannot be Blank").notEmpty();
    req.assert("content", "Page Content Cannot be Blank").notEmpty();
    var error = req.validationErrors();

    if (error) {
      req.flash("success_msg", "".concat(error[0].msg));
      return res.redirect("back");
    } else {
      req.body.name = req.body.name.trim();
      req.body.slug = req.body.name.trim().toLowerCase().split(" ").join("-");

      _pages["default"].updateOne({
        _id: req.body.pageId
      }, req.body).then(function (created) {
        req.flash("success_msg", "Page Updated Successfully");
        return res.redirect("/dashboard/pages");
      })["catch"](function (e) {
        return next(e);
      });
    }
  } catch (error) {
    next(error);
  }
}); // Delete many pages

router.post("/pages/deleteMany", _auth["default"], function (req, res, next) {
  try {
    _pages["default"].deleteMany({
      _id: req.body.ids
    }).then(function (deleted) {
      if (!req.body.ids) {
        req.flash("success_msg", "Nothing was Deleted");
        return res.redirect("back");
      } else {
        req.flash("success_msg", "Pages has Been Deleted");
        return res.redirect("back");
      }
    })["catch"](function (e) {
      return next(e);
    });
  } catch (error) {
    next(error);
  }
}); // Delete single page

router.post("/pages/delete", _auth["default"], function (req, res, next) {
  try {
    _pages["default"].deleteOne({
      _id: req.body.pageId
    }).then(function (deleted) {
      req.flash("success_msg", "Page has Been Deleted");
      return res.redirect("back");
    })["catch"](function (e) {
      return next(e);
    });
  } catch (error) {
    next(error);
  }
}); // Publish many pages

router.post("/pages/publish", _auth["default"], function (req, res, next) {
  try {
    _pages["default"].updateMany({
      _id: req.body.ids
    }, {
      $set: {
        status: "published"
      }
    }).then(function (done) {
      if (!req.body.ids) {
        req.flash("success_msg", "Nothing Was Updated");
        return res.redirect("back");
      } else {
        req.flash("success_msg", "Pages has been Updated");
        return res.redirect("back");
      }
    })["catch"](function (e) {
      return next(e);
    });
  } catch (error) {
    next(error);
  }
}); // Draft many pages

router.post("/pages/draft", _auth["default"], function (req, res, next) {
  try {
    _pages["default"].updateMany({
      _id: req.body.ids
    }, {
      $set: {
        status: "draft"
      }
    }).then(function (done) {
      if (!req.body.ids) {
        req.flash("success_msg", "Nothing Was Updated");
        return res.redirect("back");
      } else {
        req.flash("success_msg", "Pages has been Updated");
        return res.redirect("back");
      }
    })["catch"](function (e) {
      return next(e);
    });
  } catch (error) {
    next(error);
  }
}); // get a page

router.get("/pages/:slug", /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var page;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return _pages["default"].findOne({
              slug: req.params.slug
            });

          case 3:
            page = _context2.sent;

            if (page) {
              _context2.next = 6;
              break;
            }

            return _context2.abrupt("return", res.render("404"));

          case 6:
            res.render("page", {
              page: page
            });
            _context2.next = 12;
            break;

          case 9:
            _context2.prev = 9;
            _context2.t0 = _context2["catch"](0);
            next(_context2.t0);

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 9]]);
  }));

  return function (_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}());
module.exports = router;