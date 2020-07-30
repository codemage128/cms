"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _auth = _interopRequireDefault(require("../helpers/auth"));

var _role = _interopRequireDefault(require("../helpers/role"));

var _users = _interopRequireDefault(require("../models/users"));

var _articles = _interopRequireDefault(require("../models/articles"));

var _tags = _interopRequireDefault(require("../models/tags"));

var _comment2 = _interopRequireDefault(require("../models/comment"));

var _category = _interopRequireDefault(require("../models/category"));

var _announcement = _interopRequireDefault(require("../models/announcement"));

var _newsletter2 = _interopRequireDefault(require("../models/newsletter"));

var _pages = _interopRequireDefault(require("../models/pages"));

var _contact = _interopRequireDefault(require("../models/contact"));

var _settings = _interopRequireDefault(require("../models/settings"));

var _media = _interopRequireDefault(require("../models/media"));

var _mail2 = _interopRequireDefault(require("../helpers/_mail"));

var _menu = _interopRequireDefault(require("../models/menu"));

var _install = _interopRequireDefault(require("../helpers/install"));

var router = _express["default"].Router();

router.use( /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _contact["default"].find();

          case 2:
            res.locals.weekContact = _context.sent;
            next();

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());
router.get("/dashboard", _install["default"].redirectToLogin, _auth["default"], (0, _role["default"])('admin'), function (req, res, next) {
  res.redirect("/dashboard/index");
});
router.get("/dashboard/index", _install["default"].redirectToLogin, _auth["default"], (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var totalUsers, pendingPost, totalComments, totalPost, latestComment, latestUsers, latestContact, latestSubscribers;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _users["default"].countDocuments({
              roleId: 'user'
            });

          case 2:
            totalUsers = _context2.sent;
            _context2.next = 5;
            return _articles["default"].countDocuments({
              active: false
            });

          case 5:
            pendingPost = _context2.sent;
            _context2.next = 8;
            return _comment2["default"].countDocuments();

          case 8:
            totalComments = _context2.sent;
            _context2.next = 11;
            return _articles["default"].countDocuments();

          case 11:
            totalPost = _context2.sent;
            _context2.next = 14;
            return _comment2["default"].find().sort({
              createdAt: -1
            }).limit(6);

          case 14:
            latestComment = _context2.sent;
            _context2.next = 17;
            return _users["default"].find({
              roleId: {
                $ne: "admin"
              }
            }).sort({
              createdAt: -1
            }).limit(6);

          case 17:
            latestUsers = _context2.sent;
            _context2.next = 20;
            return _contact["default"].find().sort({
              createdAt: -1
            }).limit(6);

          case 20:
            latestContact = _context2.sent;
            _context2.next = 23;
            return _newsletter2["default"].find().sort({
              createdAt: -1
            }).limit(6);

          case 23:
            latestSubscribers = _context2.sent;
            res.render("./admin/index", {
              title: "Dashboard",
              totalUsers: totalUsers,
              pendingPost: pendingPost,
              totalComments: totalComments,
              totalPost: totalPost,
              latestComment: latestComment,
              latestUsers: latestUsers,
              contact: latestContact,
              latestSubscribers: latestSubscribers
            });

          case 25:
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
router.get("/dashboard/all-posts", _install["default"].redirectToLogin, _auth["default"], (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var perPage, page, category, article, coun, count, _perPage, _page, _article, _coun, _count, _perPage2, _page2, _article2, _count2;

    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (!req.query.category) {
              _context3.next = 16;
              break;
            }

            perPage = 10;
            page = req.query.page || 1;
            _context3.next = 5;
            return _category["default"].findOne({
              name: req.query.category
            });

          case 5:
            category = _context3.sent;
            _context3.next = 8;
            return _articles["default"].aggregate([{
              $match: {
                $or: [{
                  category: _mongoose["default"].Types.ObjectId(category._id)
                }, {
                  subCategory: _mongoose["default"].Types.ObjectId(category._id)
                }]
              }
            }, {
              $sort: {
                createdAt: -1
              }
            }, {
              $skip: perPage * page - perPage
            }, {
              $limit: perPage
            }, {
              $lookup: {
                from: "comments",
                localField: "slug",
                foreignField: "slug",
                as: "comments"
              }
            }, {
              $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category"
              }
            }, {
              $unwind: {
                path: "$category",
                preserveNullAndEmptyArrays: true
              }
            }, {
              $lookup: {
                from: "users",
                localField: "postedBy",
                foreignField: "_id",
                as: "postedBy"
              }
            }, {
              $unwind: {
                path: "$postedBy",
                preserveNullAndEmptyArrays: true
              }
            }]);

          case 8:
            article = _context3.sent;
            _context3.next = 11;
            return _articles["default"].aggregate([{
              $match: {
                category: _mongoose["default"].Types.ObjectId(category._id)
              }
            }, {
              $sort: {
                createdAt: -1
              }
            }, {
              $lookup: {
                from: "comments",
                localField: "slug",
                foreignField: "slug",
                as: "comments"
              }
            }, {
              $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category"
              }
            }, {
              $unwind: {
                path: "$category",
                preserveNullAndEmptyArrays: true
              }
            }, {
              $lookup: {
                from: "users",
                localField: "postedBy",
                foreignField: "_id",
                as: "postedBy"
              }
            }, {
              $unwind: {
                path: "$postedBy",
                preserveNullAndEmptyArrays: true
              }
            }]);

          case 11:
            coun = _context3.sent;
            count = coun.length;
            res.render("./admin/all-post", {
              title: "Dashboard - All Posts",
              article: article,
              current: page,
              pages: Math.ceil(count / perPage),
              query: "yes",
              searchName: req.query.category
            });
            _context3.next = 38;
            break;

          case 16:
            if (!req.query.q) {
              _context3.next = 29;
              break;
            }

            _perPage = 10;
            _page = req.query.page || 1;
            _context3.next = 21;
            return _articles["default"].aggregate([{
              $match: {
                title: {
                  $regex: req.query.q,
                  $options: "$i"
                }
              }
            }, {
              $sort: {
                createdAt: -1
              }
            }, {
              $skip: _perPage * _page - _perPage
            }, {
              $limit: _perPage
            }, {
              $lookup: {
                from: "comments",
                localField: "slug",
                foreignField: "slug",
                as: "comments"
              }
            }, {
              $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category"
              }
            }, {
              $unwind: {
                path: "$category",
                preserveNullAndEmptyArrays: true
              }
            }, {
              $lookup: {
                from: "users",
                localField: "postedBy",
                foreignField: "_id",
                as: "postedBy"
              }
            }, {
              $unwind: {
                path: "$postedBy",
                preserveNullAndEmptyArrays: true
              }
            }]);

          case 21:
            _article = _context3.sent;
            _context3.next = 24;
            return _articles["default"].aggregate([{
              $match: {
                title: {
                  $regex: req.query.q,
                  $options: "$i"
                }
              }
            }, {
              $sort: {
                createdAt: -1
              }
            }, {
              $lookup: {
                from: "comments",
                localField: "slug",
                foreignField: "slug",
                as: "comments"
              }
            }, {
              $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category"
              }
            }, {
              $unwind: {
                path: "$category",
                preserveNullAndEmptyArrays: true
              }
            }, {
              $lookup: {
                from: "users",
                localField: "postedBy",
                foreignField: "_id",
                as: "postedBy"
              }
            }, {
              $unwind: {
                path: "$postedBy",
                preserveNullAndEmptyArrays: true
              }
            }]);

          case 24:
            _coun = _context3.sent;
            _count = _coun.length;
            res.render("./admin/all-post", {
              title: "Dashboard - All Posts",
              article: _article,
              current: _page,
              pages: Math.ceil(_count / _perPage),
              query: true,
              searchName: req.query.q
            });
            _context3.next = 38;
            break;

          case 29:
            _perPage2 = 10;
            _page2 = req.query.page || 1;
            _context3.next = 33;
            return _articles["default"].aggregate([{
              $sort: {
                createdAt: -1
              }
            }, {
              $skip: _perPage2 * _page2 - _perPage2
            }, {
              $limit: _perPage2
            }, {
              $lookup: {
                from: "comments",
                localField: "slug",
                foreignField: "slug",
                as: "comments"
              }
            }, // Am not preserving comments because i need it to be an array to be able to get the length
            {
              $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category"
              }
            }, {
              $unwind: {
                path: "$category",
                preserveNullAndEmptyArrays: true
              }
            }, {
              $lookup: {
                from: "users",
                localField: "postedBy",
                foreignField: "_id",
                as: "postedBy"
              }
            }, {
              $unwind: {
                path: "$postedBy",
                preserveNullAndEmptyArrays: true
              }
            }]);

          case 33:
            _article2 = _context3.sent;
            _context3.next = 36;
            return _articles["default"].countDocuments();

          case 36:
            _count2 = _context3.sent;
            res.render("./admin/all-post", {
              title: "Dashboard - All Posts",
              article: _article2,
              current: _page2,
              pages: Math.ceil(_count2 / _perPage2),
              query: "no"
            });

          case 38:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}());
router.get("/dashboard/posts/add-new", _auth["default"], _install["default"].redirectToLogin, (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            res.render("./admin/add-new-post", {
              title: "Dashboard - Posts - Add New Post"
            });

          case 1:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function (_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}());
router.get("/dashboard/posts/add-new-audio", _auth["default"], _install["default"].redirectToLogin, (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            res.render("./admin/add-new-audio", {
              title: "Dashboard - Add New Audio"
            });

          case 1:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function (_x13, _x14, _x15) {
    return _ref5.apply(this, arguments);
  };
}());
router.get("/dashboard/posts/add-new-video", _auth["default"], _install["default"].redirectToLogin, (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res, next) {
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            res.render("./admin/add-new-video", {
              title: "Dashboard - Add New Video"
            });

          case 1:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function (_x16, _x17, _x18) {
    return _ref6.apply(this, arguments);
  };
}());
router.get("/dashboard/all-posts/edit/:slug", _auth["default"], _install["default"].redirectToLogin, (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res, next) {
    var article;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.prev = 0;
            _context7.next = 3;
            return _articles["default"].findOne({
              slug: req.params.slug
            }).populate("category");

          case 3:
            article = _context7.sent;
            if (!article) res.render("404");
            _context7.t0 = article.postType;
            _context7.next = _context7.t0 === "post" ? 8 : _context7.t0 === "audio" ? 10 : _context7.t0 === "video" ? 12 : 14;
            break;

          case 8:
            res.render("./admin/edit-post", {
              title: "Edit Post - ".concat(article.title),
              article: article
            });
            return _context7.abrupt("break", 15);

          case 10:
            res.render("./admin/edit-audio", {
              title: "Edit Audio - ".concat(article.title),
              article: article
            });
            return _context7.abrupt("break", 15);

          case 12:
            res.render("./admin/edit-video", {
              title: "Edit Video - ".concat(article.title),
              article: article
            });
            return _context7.abrupt("break", 15);

          case 14:
            return _context7.abrupt("break", 15);

          case 15:
            _context7.next = 20;
            break;

          case 17:
            _context7.prev = 17;
            _context7.t1 = _context7["catch"](0);
            next(_context7.t1);

          case 20:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[0, 17]]);
  }));

  return function (_x19, _x20, _x21) {
    return _ref7.apply(this, arguments);
  };
}());
router.get("/dashboard/posts/categories", _auth["default"], _install["default"].redirectToLogin, (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res, next) {
    var perPage, page, category, count;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.prev = 0;
            perPage = 10;
            page = req.query.page || 1;

            if (!req.query.q) {
              _context8.next = 9;
              break;
            }

            _context8.next = 6;
            return _category["default"].find({
              parent: undefined,
              name: {
                $regex: req.query.q,
                $options: "$i"
              }
            });

          case 6:
            _context8.t0 = _context8.sent;
            _context8.next = 12;
            break;

          case 9:
            _context8.next = 11;
            return _category["default"].find({
              parent: undefined
            }).sort({
              createdAt: -1
            }).skip(perPage * page - perPage).limit(perPage);

          case 11:
            _context8.t0 = _context8.sent;

          case 12:
            category = _context8.t0;

            if (!req.query.q) {
              _context8.next = 19;
              break;
            }

            _context8.next = 16;
            return _category["default"].countDocuments({
              parent: undefined,
              name: {
                $regex: req.query.q,
                $options: "$i"
              }
            });

          case 16:
            _context8.t1 = _context8.sent;
            _context8.next = 22;
            break;

          case 19:
            _context8.next = 21;
            return _category["default"].countDocuments({
              parent: undefined
            });

          case 21:
            _context8.t1 = _context8.sent;

          case 22:
            count = _context8.t1;
            res.render("./admin/categories", {
              title: "Categories",
              category: category,
              current: page,
              pages: Math.ceil(count / perPage)
            });
            _context8.next = 29;
            break;

          case 26:
            _context8.prev = 26;
            _context8.t2 = _context8["catch"](0);
            next(_context8.t2);

          case 29:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[0, 26]]);
  }));

  return function (_x22, _x23, _x24) {
    return _ref8.apply(this, arguments);
  };
}());
router.get("/dashboard/posts/categories/edit/:name", _auth["default"], _install["default"].redirectToLogin, (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(req, res, next) {
    var category;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.prev = 0;
            _context9.next = 3;
            return _category["default"].findOne({
              parent: undefined,
              name: req.params.name
            });

          case 3:
            category = _context9.sent;

            if (!category) {
              res.render("404");
            } else {
              res.render("./admin/edit-category", {
                title: "Edit Category - ".concat(category.name),
                category: category
              });
            }

            _context9.next = 10;
            break;

          case 7:
            _context9.prev = 7;
            _context9.t0 = _context9["catch"](0);
            next(_context9.t0);

          case 10:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, null, [[0, 7]]);
  }));

  return function (_x25, _x26, _x27) {
    return _ref9.apply(this, arguments);
  };
}());
router.get("/dashboard/posts/tags", _auth["default"], _install["default"].redirectToLogin, (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(req, res, next) {
    var perPage, page, tags, count;
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.prev = 0;
            perPage = 10;
            page = req.query.page || 1;

            if (!req.query.q) {
              _context10.next = 9;
              break;
            }

            _context10.next = 6;
            return _tags["default"].find({
              name: {
                $regex: req.query.q,
                $options: "$i"
              }
            });

          case 6:
            _context10.t0 = _context10.sent;
            _context10.next = 12;
            break;

          case 9:
            _context10.next = 11;
            return _tags["default"].find().sort({
              createdAt: -1
            }).skip(perPage * page - perPage).limit(perPage);

          case 11:
            _context10.t0 = _context10.sent;

          case 12:
            tags = _context10.t0;

            if (!req.query.q) {
              _context10.next = 19;
              break;
            }

            _context10.next = 16;
            return _tags["default"].countDocuments({
              name: {
                $regex: req.query.q,
                $options: "$i"
              }
            });

          case 16:
            _context10.t1 = _context10.sent;
            _context10.next = 22;
            break;

          case 19:
            _context10.next = 21;
            return _tags["default"].countDocuments();

          case 21:
            _context10.t1 = _context10.sent;

          case 22:
            count = _context10.t1;
            res.render("./admin/tags", {
              title: "Posts - Tags",
              tags: tags,
              current: page,
              pages: Math.ceil(count / perPage)
            });
            _context10.next = 29;
            break;

          case 26:
            _context10.prev = 26;
            _context10.t2 = _context10["catch"](0);
            next(_context10.t2);

          case 29:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, null, [[0, 26]]);
  }));

  return function (_x28, _x29, _x30) {
    return _ref10.apply(this, arguments);
  };
}());
router.get("/dashboard/posts/tags/edit/:name", _auth["default"], _install["default"].redirectToLogin, (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(req, res, next) {
    var tag;
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.prev = 0;
            _context11.next = 3;
            return _tags["default"].findOne({
              name: req.params.name
            });

          case 3:
            tag = _context11.sent;
            if (!tag) res.render("404");
            res.render("./admin/edit-tag", {
              title: "Edit Tag - ".concat(tag.name),
              tag: tag
            });
            _context11.next = 11;
            break;

          case 8:
            _context11.prev = 8;
            _context11.t0 = _context11["catch"](0);
            next(_context11.t0);

          case 11:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, null, [[0, 8]]);
  }));

  return function (_x31, _x32, _x33) {
    return _ref11.apply(this, arguments);
  };
}());
router.get("/dashboard/announcements", _auth["default"], _install["default"].redirectToLogin, (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(req, res, next) {
    var perPage, page, announcement, count;
    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            _context12.prev = 0;
            perPage = 10;
            page = req.query.page || 1;

            if (!req.query.q) {
              _context12.next = 9;
              break;
            }

            _context12.next = 6;
            return _announcement["default"].find({
              title: {
                $regex: req.query.q,
                $options: "$i"
              }
            });

          case 6:
            _context12.t0 = _context12.sent;
            _context12.next = 12;
            break;

          case 9:
            _context12.next = 11;
            return _announcement["default"].find().sort({
              createdAt: -1
            }).skip(perPage * page - perPage).limit(perPage);

          case 11:
            _context12.t0 = _context12.sent;

          case 12:
            announcement = _context12.t0;

            if (!req.query.q) {
              _context12.next = 19;
              break;
            }

            _context12.next = 16;
            return _announcement["default"].countDocuments({
              title: {
                $regex: req.query.q,
                $options: "$i"
              }
            });

          case 16:
            _context12.t1 = _context12.sent;
            _context12.next = 22;
            break;

          case 19:
            _context12.next = 21;
            return _announcement["default"].countDocuments();

          case 21:
            _context12.t1 = _context12.sent;

          case 22:
            count = _context12.t1;
            res.render("./admin/announcement", {
              title: "Dashboard - Announcements",
              announcement: announcement,
              current: page,
              pages: Math.ceil(count / perPage)
            });
            _context12.next = 29;
            break;

          case 26:
            _context12.prev = 26;
            _context12.t2 = _context12["catch"](0);
            next(_context12.t2);

          case 29:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12, null, [[0, 26]]);
  }));

  return function (_x34, _x35, _x36) {
    return _ref12.apply(this, arguments);
  };
}());
router.get("/dashboard/announcements/add-new", _auth["default"], _install["default"].redirectToLogin, (0, _role["default"])("admin"), function (req, res, next) {
  try {
    res.render("./admin/add-new-announcement", {
      title: "Announcements - Add New"
    });
  } catch (error) {
    next(error);
  }
});
router.get("/dashboard/announcements/edit/:id", _auth["default"], _install["default"].redirectToLogin, (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref13 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(req, res, next) {
    var announcement;
    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            _context13.prev = 0;

            if (!_mongoose["default"].Types.ObjectId.isValid(req.params.id)) {
              _context13.next = 8;
              break;
            }

            _context13.next = 4;
            return _announcement["default"].findById(req.params.id);

          case 4:
            announcement = _context13.sent;
            res.render("./admin/edit-announcement", {
              title: "Edit Announcement - ".concat(announcement.title),
              announcement: announcement
            });
            _context13.next = 9;
            break;

          case 8:
            res.render("404");

          case 9:
            _context13.next = 14;
            break;

          case 11:
            _context13.prev = 11;
            _context13.t0 = _context13["catch"](0);
            next(_context13.t0);

          case 14:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13, null, [[0, 11]]);
  }));

  return function (_x37, _x38, _x39) {
    return _ref13.apply(this, arguments);
  };
}());
router.get("/dashboard/newsletter", _auth["default"], _install["default"].redirectToLogin, (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref14 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14(req, res, next) {
    var perPage, page, newsletter, count, _newsletter, _count3;

    return _regenerator["default"].wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            _context14.prev = 0;
            perPage = 10;
            page = req.query.page || 1;

            if (!req.query.q) {
              _context14.next = 13;
              break;
            }

            _context14.next = 6;
            return _newsletter2["default"].find({
              $or: [{
                firstname: {
                  $regex: req.query.q,
                  $options: "i"
                }
              }, {
                lastname: {
                  $regex: req.query.q,
                  $options: "i"
                }
              }, {
                email: {
                  $regex: req.query.q,
                  $options: "i"
                }
              }]
            }).skip(perPage * page - perPage).limit(perPage);

          case 6:
            newsletter = _context14.sent;
            _context14.next = 9;
            return _newsletter2["default"].countDocuments({
              $or: [{
                firstname: {
                  $regex: req.query.q,
                  $options: "i"
                }
              }, {
                lastname: {
                  $regex: req.query.q,
                  $options: "i"
                }
              }, {
                email: {
                  $regex: req.query.q,
                  $options: "i"
                }
              }]
            });

          case 9:
            count = _context14.sent;
            res.render("./admin/newsletter", {
              title: "Dashboard - Newsletter Subscribers",
              newsletter: newsletter,
              current: page,
              pages: Math.ceil(count / perPage),
              query: true,
              search: req.query.q
            });
            _context14.next = 20;
            break;

          case 13:
            _context14.next = 15;
            return _newsletter2["default"].find().sort({
              createdAt: -1
            }).skip(perPage * page - perPage).limit(perPage);

          case 15:
            _newsletter = _context14.sent;
            _context14.next = 18;
            return _newsletter2["default"].countDocuments();

          case 18:
            _count3 = _context14.sent;
            res.render("./admin/newsletter", {
              title: "Dashboard - Newsletter Subscribers",
              newsletter: _newsletter,
              current: page,
              pages: Math.ceil(_count3 / perPage),
              query: false
            });

          case 20:
            _context14.next = 25;
            break;

          case 22:
            _context14.prev = 22;
            _context14.t0 = _context14["catch"](0);
            next(_context14.t0);

          case 25:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14, null, [[0, 22]]);
  }));

  return function (_x40, _x41, _x42) {
    return _ref14.apply(this, arguments);
  };
}());
router.get("/dashboard/newsletter/edit/:email", _auth["default"], _install["default"].redirectToLogin, (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref15 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15(req, res, next) {
    var newsletter;
    return _regenerator["default"].wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            _context15.prev = 0;
            _context15.next = 3;
            return _newsletter2["default"].findOne({
              email: req.params.email
            });

          case 3:
            newsletter = _context15.sent;
            if (!newsletter) res.render("404");else {
              res.render("./admin/edit-newsletter", {
                title: "Update Newsletter - ".concat(newsletter.email),
                newsletter: newsletter
              });
            }
            _context15.next = 10;
            break;

          case 7:
            _context15.prev = 7;
            _context15.t0 = _context15["catch"](0);
            next(_context15.t0);

          case 10:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15, null, [[0, 7]]);
  }));

  return function (_x43, _x44, _x45) {
    return _ref15.apply(this, arguments);
  };
}());
router.get("/dashboard/newsletter/compose", _auth["default"], _install["default"].redirectToLogin, (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref16 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee16(req, res, next) {
    var media;
    return _regenerator["default"].wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            _context16.prev = 0;
            _context16.next = 3;
            return _media["default"].find().sort({
              createdAt: -1
            });

          case 3:
            media = _context16.sent;
            res.render("./admin/compose-newsletter", {
              title: "Newsletter - Compose",
              media: media
            });
            _context16.next = 10;
            break;

          case 7:
            _context16.prev = 7;
            _context16.t0 = _context16["catch"](0);
            next(_context16.t0);

          case 10:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16, null, [[0, 7]]);
  }));

  return function (_x46, _x47, _x48) {
    return _ref16.apply(this, arguments);
  };
}());
router.get("/dashboard/pages", _auth["default"], _install["default"].redirectToLogin, (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref17 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee17(req, res, next) {
    var perPage, page, query, search, pages, count;
    return _regenerator["default"].wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            _context17.prev = 0;
            perPage = 10;
            page = req.query.page || 1;
            query = req.query.q ? true : false;
            search = req.query.q ? req.query.q : undefined;

            if (!req.query.q) {
              _context17.next = 11;
              break;
            }

            _context17.next = 8;
            return _pages["default"].find({
              name: {
                $regex: req.query.q,
                $options: "i"
              }
            }).populate("author");

          case 8:
            _context17.t0 = _context17.sent;
            _context17.next = 14;
            break;

          case 11:
            _context17.next = 13;
            return _pages["default"].find().populate("author").sort({
              createdAt: -1
            }).skip(perPage * page - perPage).limit(perPage);

          case 13:
            _context17.t0 = _context17.sent;

          case 14:
            pages = _context17.t0;

            if (!req.query.q) {
              _context17.next = 21;
              break;
            }

            _context17.next = 18;
            return _pages["default"].countDocuments({
              name: {
                $regex: req.query.q,
                $options: "i"
              }
            });

          case 18:
            _context17.t1 = _context17.sent;
            _context17.next = 24;
            break;

          case 21:
            _context17.next = 23;
            return _pages["default"].countDocuments();

          case 23:
            _context17.t1 = _context17.sent;

          case 24:
            count = _context17.t1;
            res.render("./admin/pages", {
              title: "Dashboard - Pages",
              allpages: pages,
              current: page,
              pages: Math.ceil(count / perPage),
              query: query,
              search: search
            });
            _context17.next = 31;
            break;

          case 28:
            _context17.prev = 28;
            _context17.t2 = _context17["catch"](0);
            next(_context17.t2);

          case 31:
          case "end":
            return _context17.stop();
        }
      }
    }, _callee17, null, [[0, 28]]);
  }));

  return function (_x49, _x50, _x51) {
    return _ref17.apply(this, arguments);
  };
}());
router.get("/dashboard/pages/add-new", _auth["default"], _install["default"].redirectToLogin, (0, _role["default"])("admin"), function (req, res, next) {
  try {
    res.render("./admin/add-new-page", {
      title: "Pages - Add new Page"
    });
  } catch (error) {
    next(error);
  }
});
router.get("/dashboard/pages/edit/:name", _auth["default"], _install["default"].redirectToLogin, (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref18 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee18(req, res, next) {
    var page;
    return _regenerator["default"].wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            _context18.prev = 0;
            _context18.next = 3;
            return _pages["default"].findOne({
              name: req.params.name
            });

          case 3:
            page = _context18.sent;
            if (!page) res.render("404");else {
              res.render("./admin/edit-page", {
                title: "Edit Page - ".concat(page.name),
                page: page
              });
            }
            _context18.next = 10;
            break;

          case 7:
            _context18.prev = 7;
            _context18.t0 = _context18["catch"](0);
            next(_context18.t0);

          case 10:
          case "end":
            return _context18.stop();
        }
      }
    }, _callee18, null, [[0, 7]]);
  }));

  return function (_x52, _x53, _x54) {
    return _ref18.apply(this, arguments);
  };
}());
router.get("/dashboard/comments", _auth["default"], _install["default"].redirectToLogin, (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref19 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee19(req, res, next) {
    var perPage, page, comment, coun, count, _count4, _comment;

    return _regenerator["default"].wrap(function _callee19$(_context19) {
      while (1) {
        switch (_context19.prev = _context19.next) {
          case 0:
            _context19.prev = 0;
            perPage = 10;
            page = req.query.page || 1;

            if (!req.query.q) {
              _context19.next = 14;
              break;
            }

            _context19.next = 6;
            return _comment2["default"].aggregate([{
              $lookup: {
                from: "articles",
                localField: "slug",
                foreignField: "slug",
                as: "articleInfo"
              }
            }, {
              $unwind: {
                path: "$articleInfo",
                preserveNullAndEmptyArrays: true
              }
            }, {
              $match: {
                $or: [{
                  name: {
                    $regex: req.query.q,
                    $options: "$i"
                  }
                }, {
                  email: {
                    $regex: req.query.q,
                    $options: "$i"
                  }
                }, {
                  comment: {
                    $regex: req.query.q,
                    $options: "$i"
                  }
                }, {
                  "articleInfo.title": {
                    $regex: req.query.q,
                    $options: "$i"
                  }
                }]
              }
            }, {
              $sort: {
                createdAt: -1
              }
            }, {
              $skip: perPage * page - perPage
            }, {
              $limit: perPage
            }, {
              $lookup: {
                from: "articles",
                localField: "slug",
                foreignField: "slug",
                as: "articleInfo"
              }
            }, {
              $unwind: {
                path: "$articleInfo",
                preserveNullAndEmptyArrays: true
              }
            }]);

          case 6:
            comment = _context19.sent;
            _context19.next = 9;
            return _comment2["default"].aggregate([{
              $lookup: {
                from: "articles",
                localField: "slug",
                foreignField: "slug",
                as: "articleInfo"
              }
            }, {
              $unwind: {
                path: "$articleInfo",
                preserveNullAndEmptyArrays: true
              }
            }, {
              $match: {
                $or: [{
                  name: {
                    $regex: req.query.q,
                    $options: "$i"
                  }
                }, {
                  email: {
                    $regex: req.query.q,
                    $options: "$i"
                  }
                }, {
                  comment: {
                    $regex: req.query.q,
                    $options: "$i"
                  }
                }, {
                  "articleInfo.title": {
                    $regex: req.query.q,
                    $options: "$i"
                  }
                }]
              }
            }, {
              $sort: {
                createdAt: -1
              }
            }, {
              $lookup: {
                from: "articles",
                localField: "slug",
                foreignField: "slug",
                as: "articleInfo"
              }
            }, {
              $unwind: {
                path: "$articleInfo",
                preserveNullAndEmptyArrays: true
              }
            }]);

          case 9:
            coun = _context19.sent;
            count = coun.length;
            res.render("./admin/comments", {
              title: "Dashboard - Comments",
              comment: comment,
              current: page,
              pages: Math.ceil(count / perPage),
              query: true,
              search: req.query.q
            });
            _context19.next = 21;
            break;

          case 14:
            _context19.next = 16;
            return _comment2["default"].countDocuments();

          case 16:
            _count4 = _context19.sent;
            _context19.next = 19;
            return _comment2["default"].aggregate([{
              $sort: {
                createdAt: -1
              }
            }, {
              $skip: perPage * page - perPage
            }, {
              $limit: perPage
            }, {
              $lookup: {
                from: "articles",
                localField: "slug",
                foreignField: "slug",
                as: "articleInfo"
              }
            }, {
              $unwind: {
                path: "$articleInfo",
                preserveNullAndEmptyArrays: true
              }
            }]);

          case 19:
            _comment = _context19.sent;
            res.render("./admin/comments", {
              title: "Dashboard - Comments",
              comment: _comment,
              current: page,
              pages: Math.ceil(_count4 / perPage),
              query: false
            });

          case 21:
            _context19.next = 26;
            break;

          case 23:
            _context19.prev = 23;
            _context19.t0 = _context19["catch"](0);
            next(_context19.t0);

          case 26:
          case "end":
            return _context19.stop();
        }
      }
    }, _callee19, null, [[0, 23]]);
  }));

  return function (_x55, _x56, _x57) {
    return _ref19.apply(this, arguments);
  };
}());
router.get("/dashboard/comments/edit/:id", _auth["default"], _install["default"].redirectToLogin, (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref20 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee20(req, res, next) {
    var comment;
    return _regenerator["default"].wrap(function _callee20$(_context20) {
      while (1) {
        switch (_context20.prev = _context20.next) {
          case 0:
            _context20.prev = 0;
            _context20.next = 3;
            return _comment2["default"].findOne({
              _id: req.params.id
            });

          case 3:
            comment = _context20.sent;
            if (!comment) res.render("404");else {
              res.render("./admin/edit-comment", {
                title: "Edit Comment - ".concat(comment.email),
                comment: comment
              });
            }
            _context20.next = 10;
            break;

          case 7:
            _context20.prev = 7;
            _context20.t0 = _context20["catch"](0);
            next(_context20.t0);

          case 10:
          case "end":
            return _context20.stop();
        }
      }
    }, _callee20, null, [[0, 7]]);
  }));

  return function (_x58, _x59, _x60) {
    return _ref20.apply(this, arguments);
  };
}());
router.get("/dashboard/contacts", _auth["default"], _install["default"].redirectToLogin, (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref21 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee21(req, res, next) {
    var perPage, page, query, search, contact, count;
    return _regenerator["default"].wrap(function _callee21$(_context21) {
      while (1) {
        switch (_context21.prev = _context21.next) {
          case 0:
            _context21.prev = 0;
            perPage = 10;
            page = req.query.page || 1;
            query = req.query.q ? true : false;
            search = req.query.q ? req.query.q : undefined;

            if (!req.query.q) {
              _context21.next = 11;
              break;
            }

            _context21.next = 8;
            return _contact["default"].find({
              $or: [{
                fullname: {
                  $regex: req.query.q,
                  $options: "$i"
                }
              }, {
                email: {
                  $regex: req.query.q,
                  $options: "$i"
                }
              }, {
                message: {
                  $regex: req.query.q,
                  $options: "$i"
                }
              }]
            }).skip(perPage * page - perPage).limit(perPage);

          case 8:
            _context21.t0 = _context21.sent;
            _context21.next = 14;
            break;

          case 11:
            _context21.next = 13;
            return _contact["default"].find().sort({
              createdAt: -1
            }).skip(perPage * page - perPage).limit(perPage);

          case 13:
            _context21.t0 = _context21.sent;

          case 14:
            contact = _context21.t0;

            if (!req.query.q) {
              _context21.next = 21;
              break;
            }

            _context21.next = 18;
            return _contact["default"].countDocuments({
              $or: [{
                fullname: {
                  $regex: req.query.q,
                  $options: "$i"
                }
              }, {
                email: {
                  $regex: req.query.q,
                  $options: "$i"
                }
              }, {
                message: {
                  $regex: req.query.q,
                  $options: "$i"
                }
              }]
            });

          case 18:
            _context21.t1 = _context21.sent;
            _context21.next = 24;
            break;

          case 21:
            _context21.next = 23;
            return _contact["default"].countDocuments();

          case 23:
            _context21.t1 = _context21.sent;

          case 24:
            count = _context21.t1;
            res.render("./admin/contact", {
              title: "Dashboard - Contacts",
              contact: contact,
              current: page,
              pages: Math.ceil(count / perPage),
              query: query,
              search: search
            });
            _context21.next = 31;
            break;

          case 28:
            _context21.prev = 28;
            _context21.t2 = _context21["catch"](0);
            next(_context21.t2);

          case 31:
          case "end":
            return _context21.stop();
        }
      }
    }, _callee21, null, [[0, 28]]);
  }));

  return function (_x61, _x62, _x63) {
    return _ref21.apply(this, arguments);
  };
}());
router.get("/dashboard/contacts/view/:id", _auth["default"], _install["default"].redirectToLogin, (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref22 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee22(req, res, next) {
    var contact;
    return _regenerator["default"].wrap(function _callee22$(_context22) {
      while (1) {
        switch (_context22.prev = _context22.next) {
          case 0:
            _context22.prev = 0;

            if (!_mongoose["default"].Types.ObjectId.isValid(req.params.id)) {
              _context22.next = 8;
              break;
            }

            _context22.next = 4;
            return _contact["default"].findById(req.params.id);

          case 4:
            contact = _context22.sent;
            res.render("./admin/view-contact", {
              title: "Contact - View Full Message",
              contact: contact
            });
            _context22.next = 9;
            break;

          case 8:
            res.render("404");

          case 9:
            _context22.next = 14;
            break;

          case 11:
            _context22.prev = 11;
            _context22.t0 = _context22["catch"](0);
            next(_context22.t0);

          case 14:
          case "end":
            return _context22.stop();
        }
      }
    }, _callee22, null, [[0, 11]]);
  }));

  return function (_x64, _x65, _x66) {
    return _ref22.apply(this, arguments);
  };
}());
router.get("/dashboard/users", _auth["default"], _install["default"].redirectToLogin, (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref23 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee23(req, res, next) {
    var perPage, page, users, count;
    return _regenerator["default"].wrap(function _callee23$(_context23) {
      while (1) {
        switch (_context23.prev = _context23.next) {
          case 0:
            _context23.prev = 0;
            perPage = 10;
            page = req.query.page || 1;

            if (!req.query.q) {
              _context23.next = 9;
              break;
            }

            _context23.next = 6;
            return _users["default"].find({
              roleId: {
                $ne: "admin"
              },
              $or: [{
                username: {
                  $regex: req.query.q,
                  $options: "i"
                }
              }, {
                email: {
                  $regex: req.query.q,
                  $options: "i"
                }
              }]
            }).skip(perPage * page - perPage).limit(perPage);

          case 6:
            _context23.t0 = _context23.sent;
            _context23.next = 12;
            break;

          case 9:
            _context23.next = 11;
            return _users["default"].find({
              roleId: {
                $ne: "admin"
              }
            }).sort({
              createdAt: -1
            }).skip(perPage * page - perPage).limit(perPage);

          case 11:
            _context23.t0 = _context23.sent;

          case 12:
            users = _context23.t0;

            if (!req.query.q) {
              _context23.next = 19;
              break;
            }

            _context23.next = 16;
            return _users["default"].countDocuments({
              roleId: {
                $ne: "admin"
              },
              $or: [{
                username: {
                  $regex: req.query.q,
                  $options: "i"
                }
              }, {
                email: {
                  $regex: req.query.q,
                  $options: "i"
                }
              }]
            });

          case 16:
            _context23.t1 = _context23.sent;
            _context23.next = 22;
            break;

          case 19:
            _context23.next = 21;
            return _users["default"].countDocuments({
              roleId: {
                $ne: "admin"
              }
            });

          case 21:
            _context23.t1 = _context23.sent;

          case 22:
            count = _context23.t1;
            res.render("./admin/users", {
              title: "Dashboard - Users",
              allusers: users,
              current: page,
              pages: Math.ceil(count / perPage)
            });
            _context23.next = 29;
            break;

          case 26:
            _context23.prev = 26;
            _context23.t2 = _context23["catch"](0);
            next(_context23.t2);

          case 29:
          case "end":
            return _context23.stop();
        }
      }
    }, _callee23, null, [[0, 26]]);
  }));

  return function (_x67, _x68, _x69) {
    return _ref23.apply(this, arguments);
  };
}());
router.get("/dashboard/administrators", _auth["default"], _install["default"].redirectToLogin, (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref24 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee24(req, res, next) {
    var perPage, page, users, count;
    return _regenerator["default"].wrap(function _callee24$(_context24) {
      while (1) {
        switch (_context24.prev = _context24.next) {
          case 0:
            _context24.prev = 0;
            perPage = 10;
            page = req.query.page || 1;

            if (!req.query.q) {
              _context24.next = 9;
              break;
            }

            _context24.next = 6;
            return _users["default"].find({
              roleId: "admin",
              $or: [{
                username: {
                  $regex: req.query.q,
                  $options: "i"
                }
              }, {
                email: {
                  $regex: req.query.q,
                  $options: "i"
                }
              }]
            }).skip(perPage * page - perPage).limit(perPage);

          case 6:
            _context24.t0 = _context24.sent;
            _context24.next = 12;
            break;

          case 9:
            _context24.next = 11;
            return _users["default"].find({
              roleId: "admin"
            }).sort({
              createdAt: -1
            }).skip(perPage * page - perPage).limit(perPage);

          case 11:
            _context24.t0 = _context24.sent;

          case 12:
            users = _context24.t0;

            if (!req.query.q) {
              _context24.next = 19;
              break;
            }

            _context24.next = 16;
            return _users["default"].countDocuments({
              roleId: "admin",
              $or: [{
                username: {
                  $regex: req.query.q,
                  $options: "i"
                }
              }, {
                email: {
                  $regex: req.query.q,
                  $options: "i"
                }
              }]
            });

          case 16:
            _context24.t1 = _context24.sent;
            _context24.next = 22;
            break;

          case 19:
            _context24.next = 21;
            return _users["default"].countDocuments({
              roleId: "admin"
            });

          case 21:
            _context24.t1 = _context24.sent;

          case 22:
            count = _context24.t1;
            res.render("./admin/admin", {
              title: "Dashboard - Administrators",
              allusers: users,
              current: page,
              pages: Math.ceil(count / perPage)
            });
            _context24.next = 29;
            break;

          case 26:
            _context24.prev = 26;
            _context24.t2 = _context24["catch"](0);
            next(_context24.t2);

          case 29:
          case "end":
            return _context24.stop();
        }
      }
    }, _callee24, null, [[0, 26]]);
  }));

  return function (_x70, _x71, _x72) {
    return _ref24.apply(this, arguments);
  };
}());
router.get("/dashboard/users/edit/:username", _auth["default"], _install["default"].redirectToLogin, (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref25 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee25(req, res, next) {
    var userInfo;
    return _regenerator["default"].wrap(function _callee25$(_context25) {
      while (1) {
        switch (_context25.prev = _context25.next) {
          case 0:
            _context25.prev = 0;
            _context25.next = 3;
            return _users["default"].findOne({
              username: req.params.username
            });

          case 3:
            userInfo = _context25.sent;
            if (!userInfo) res.render("404");else {
              res.render("./admin/edit-users", {
                title: "Edit User - ".concat(userInfo.username),
                userInfo: userInfo
              });
            }
            _context25.next = 10;
            break;

          case 7:
            _context25.prev = 7;
            _context25.t0 = _context25["catch"](0);
            next(_context25.t0);

          case 10:
          case "end":
            return _context25.stop();
        }
      }
    }, _callee25, null, [[0, 7]]);
  }));

  return function (_x73, _x74, _x75) {
    return _ref25.apply(this, arguments);
  };
}());
router.get("/dashboard/users/add-new", _auth["default"], _install["default"].redirectToLogin, (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref26 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee26(req, res, next) {
    return _regenerator["default"].wrap(function _callee26$(_context26) {
      while (1) {
        switch (_context26.prev = _context26.next) {
          case 0:
            try {
              res.render("./admin/add-new-user", {
                title: "Users - Add New"
              });
            } catch (error) {
              next(error);
            }

          case 1:
          case "end":
            return _context26.stop();
        }
      }
    }, _callee26);
  }));

  return function (_x76, _x77, _x78) {
    return _ref26.apply(this, arguments);
  };
}());
router.get("/profile", _auth["default"], _install["default"].redirectToLogin, (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref27 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee27(req, res, next) {
    return _regenerator["default"].wrap(function _callee27$(_context27) {
      while (1) {
        switch (_context27.prev = _context27.next) {
          case 0:
            try {
              res.render("./admin/profile", {
                title: "My Profile"
              });
            } catch (error) {
              next(error);
            }

          case 1:
          case "end":
            return _context27.stop();
        }
      }
    }, _callee27);
  }));

  return function (_x79, _x80, _x81) {
    return _ref27.apply(this, arguments);
  };
}());
router.get("/dashboard/settings/general", _auth["default"], _install["default"].redirectToLogin, (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref28 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee28(req, res, next) {
    var settings;
    return _regenerator["default"].wrap(function _callee28$(_context28) {
      while (1) {
        switch (_context28.prev = _context28.next) {
          case 0:
            _context28.prev = 0;
            _context28.next = 3;
            return _settings["default"].findOne();

          case 3:
            settings = _context28.sent;
            res.render("./admin/general-settings", {
              title: "General Settings",
              settings: settings
            });
            _context28.next = 10;
            break;

          case 7:
            _context28.prev = 7;
            _context28.t0 = _context28["catch"](0);
            next(_context28.t0);

          case 10:
          case "end":
            return _context28.stop();
        }
      }
    }, _callee28, null, [[0, 7]]);
  }));

  return function (_x82, _x83, _x84) {
    return _ref28.apply(this, arguments);
  };
}());
router.get("/dashboard/settings/email", _auth["default"], _install["default"].redirectToLogin, (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref29 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee29(req, res, next) {
    var settings;
    return _regenerator["default"].wrap(function _callee29$(_context29) {
      while (1) {
        switch (_context29.prev = _context29.next) {
          case 0:
            _context29.prev = 0;
            _context29.next = 3;
            return _settings["default"].findOne();

          case 3:
            settings = _context29.sent;
            res.render("./admin/email-settings", {
              title: "Email Settings",
              settings: settings
            });
            _context29.next = 10;
            break;

          case 7:
            _context29.prev = 7;
            _context29.t0 = _context29["catch"](0);
            next(_context29.t0);

          case 10:
          case "end":
            return _context29.stop();
        }
      }
    }, _callee29, null, [[0, 7]]);
  }));

  return function (_x85, _x86, _x87) {
    return _ref29.apply(this, arguments);
  };
}());
router.get("/dashboard/settings/media", _auth["default"], _install["default"].redirectToLogin, (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref30 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee30(req, res, next) {
    var settings;
    return _regenerator["default"].wrap(function _callee30$(_context30) {
      while (1) {
        switch (_context30.prev = _context30.next) {
          case 0:
            _context30.prev = 0;
            _context30.next = 3;
            return _settings["default"].findOne();

          case 3:
            settings = _context30.sent;
            res.render("./admin/media-settings", {
              title: "Media Settings",
              settings: settings
            });
            _context30.next = 10;
            break;

          case 7:
            _context30.prev = 7;
            _context30.t0 = _context30["catch"](0);
            next(_context30.t0);

          case 10:
          case "end":
            return _context30.stop();
        }
      }
    }, _callee30, null, [[0, 7]]);
  }));

  return function (_x88, _x89, _x90) {
    return _ref30.apply(this, arguments);
  };
}());
router.get("/dashboard/ad-spaces", _auth["default"], _install["default"].redirectToLogin, (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref31 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee31(req, res, next) {
    return _regenerator["default"].wrap(function _callee31$(_context31) {
      while (1) {
        switch (_context31.prev = _context31.next) {
          case 0:
            try {
              res.render("./admin/ad-spaces", {
                title: "Advert Spaces"
              });
            } catch (error) {
              next(error);
            }

          case 1:
          case "end":
            return _context31.stop();
        }
      }
    }, _callee31);
  }));

  return function (_x91, _x92, _x93) {
    return _ref31.apply(this, arguments);
  };
}());
router.get("/dashboard/library", _auth["default"], _install["default"].redirectToLogin, (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref32 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee32(req, res, next) {
    var perPage, page, media, count;
    return _regenerator["default"].wrap(function _callee32$(_context32) {
      while (1) {
        switch (_context32.prev = _context32.next) {
          case 0:
            _context32.prev = 0;
            perPage = 48;
            page = req.query.page || 1;
            _context32.next = 5;
            return _media["default"].find({
              file_type: {
                $regex: "image",
                $options: "$i"
              }
            }).sort({
              createdAt: -1
            }).skip(perPage * page - perPage).limit(perPage);

          case 5:
            media = _context32.sent;
            _context32.next = 8;
            return _media["default"].countDocuments({
              file_type: {
                $regex: "image",
                $options: "$i"
              }
            });

          case 8:
            count = _context32.sent;
            res.render("./admin/media", {
              title: "Dashboard Media",
              media: media,
              current: page,
              pages: Math.ceil(count / perPage)
            });
            _context32.next = 15;
            break;

          case 12:
            _context32.prev = 12;
            _context32.t0 = _context32["catch"](0);
            next(_context32.t0);

          case 15:
          case "end":
            return _context32.stop();
        }
      }
    }, _callee32, null, [[0, 12]]);
  }));

  return function (_x94, _x95, _x96) {
    return _ref32.apply(this, arguments);
  };
}());
router.get("/dashboard/media/add-new", _auth["default"], _install["default"].redirectToLogin, (0, _role["default"])("admin"), function (req, res, next) {
  try {
    res.render("./admin/add-new-media", {
      title: "Media - Add new Media"
    });
  } catch (error) {
    next(error);
  }
});
router.get("/dashboard/social-login", _auth["default"], _install["default"].redirectToLogin, (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref33 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee33(req, res, next) {
    var settings;
    return _regenerator["default"].wrap(function _callee33$(_context33) {
      while (1) {
        switch (_context33.prev = _context33.next) {
          case 0:
            _context33.prev = 0;
            _context33.next = 3;
            return _settings["default"].findOne();

          case 3:
            settings = _context33.sent;
            res.render("./admin/social-login", {
              title: "Social Login Configuration",
              settings: settings
            });
            _context33.next = 10;
            break;

          case 7:
            _context33.prev = 7;
            _context33.t0 = _context33["catch"](0);
            next(_context33.t0);

          case 10:
          case "end":
            return _context33.stop();
        }
      }
    }, _callee33, null, [[0, 7]]);
  }));

  return function (_x97, _x98, _x99) {
    return _ref33.apply(this, arguments);
  };
}());
router.get("/dashboard/preferences", _auth["default"], _install["default"].redirectToLogin, (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref34 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee34(req, res, next) {
    var settings;
    return _regenerator["default"].wrap(function _callee34$(_context34) {
      while (1) {
        switch (_context34.prev = _context34.next) {
          case 0:
            _context34.prev = 0;
            _context34.next = 3;
            return _settings["default"].findOne();

          case 3:
            settings = _context34.sent;
            res.render("./admin/preferences", {
              title: "Preferences",
              settings: settings
            });
            _context34.next = 10;
            break;

          case 7:
            _context34.prev = 7;
            _context34.t0 = _context34["catch"](0);
            next(_context34.t0);

          case 10:
          case "end":
            return _context34.stop();
        }
      }
    }, _callee34, null, [[0, 7]]);
  }));

  return function (_x100, _x101, _x102) {
    return _ref34.apply(this, arguments);
  };
}());
router.get("/dashboard/posts/sub-categories", _auth["default"], _install["default"].redirectToLogin, (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref35 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee35(req, res, next) {
    var perPage, page, category, count2, count;
    return _regenerator["default"].wrap(function _callee35$(_context35) {
      while (1) {
        switch (_context35.prev = _context35.next) {
          case 0:
            _context35.prev = 0;
            perPage = 10;
            page = req.query.page || 1;

            if (!req.query.q) {
              _context35.next = 9;
              break;
            }

            _context35.next = 6;
            return _category["default"].aggregate([{
              $match: {
                name: {
                  $regex: req.query.q,
                  $options: "$i"
                },
                parent: {
                  $exists: {
                    $ne: false
                  }
                }
              }
            }, {
              $lookup: {
                from: "categories",
                localField: "parent",
                foreignField: "_id",
                as: "parent"
              }
            }, {
              $unwind: {
                path: "$parent",
                preserveNullAndEmptyArrays: true
              }
            }, {
              $sort: {
                createdAt: -1
              }
            }, {
              $skip: perPage * page - perPage
            }, {
              $limit: perPage
            }]);

          case 6:
            _context35.t0 = _context35.sent;
            _context35.next = 12;
            break;

          case 9:
            _context35.next = 11;
            return _category["default"].aggregate([{
              $match: {
                parent: {
                  $exists: {
                    $ne: false
                  }
                }
              }
            }, {
              $lookup: {
                from: "categories",
                localField: "parent",
                foreignField: "_id",
                as: "parent"
              }
            }, {
              $unwind: {
                path: "$parent",
                preserveNullAndEmptyArrays: true
              }
            }, {
              $sort: {
                createdAt: -1
              }
            }, {
              $skip: perPage * page - perPage
            }, {
              $limit: perPage
            }]);

          case 11:
            _context35.t0 = _context35.sent;

          case 12:
            category = _context35.t0;
            _context35.next = 15;
            return _category["default"].aggregate([{
              $match: {
                parent: {
                  $exists: {
                    $ne: false
                  }
                }
              }
            }, {
              $lookup: {
                from: "categories",
                localField: "parent",
                foreignField: "_id",
                as: "parent"
              }
            }, {
              $unwind: {
                path: "$parent",
                preserveNullAndEmptyArrays: true
              }
            }]);

          case 15:
            count2 = _context35.sent;

            if (!req.query.q) {
              _context35.next = 22;
              break;
            }

            _context35.next = 19;
            return _category["default"].aggregate([{
              $match: {
                name: {
                  $regex: req.query.q,
                  $options: "$i"
                },
                parent: {
                  $exists: {
                    $ne: false
                  }
                }
              }
            }]);

          case 19:
            _context35.t1 = _context35.sent;
            _context35.next = 23;
            break;

          case 22:
            _context35.t1 = count2.length;

          case 23:
            count = _context35.t1;
            res.render("./admin/subcategory", {
              title: "Categories - Sub Categories",
              category: category,
              current: page,
              pages: Math.ceil(count.length / perPage)
            });
            _context35.next = 30;
            break;

          case 27:
            _context35.prev = 27;
            _context35.t2 = _context35["catch"](0);
            next(_context35.t2);

          case 30:
          case "end":
            return _context35.stop();
        }
      }
    }, _callee35, null, [[0, 27]]);
  }));

  return function (_x103, _x104, _x105) {
    return _ref35.apply(this, arguments);
  };
}());
router.get("/dashboard/posts/subcategory/edit/:name", _auth["default"], _install["default"].redirectToLogin, (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref36 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee36(req, res, next) {
    var category;
    return _regenerator["default"].wrap(function _callee36$(_context36) {
      while (1) {
        switch (_context36.prev = _context36.next) {
          case 0:
            _context36.prev = 0;
            _context36.next = 3;
            return _category["default"].findOne({
              parent: {
                $ne: undefined
              },
              name: req.params.name
            }).populate("parent");

          case 3:
            category = _context36.sent;

            if (!category) {
              res.render("404");
            } else {
              res.render("./admin/edit-subcategory", {
                title: "Edit Subcategory - ".concat(category.name),
                category: category
              });
            }

            _context36.next = 10;
            break;

          case 7:
            _context36.prev = 7;
            _context36.t0 = _context36["catch"](0);
            next(_context36.t0);

          case 10:
          case "end":
            return _context36.stop();
        }
      }
    }, _callee36, null, [[0, 7]]);
  }));

  return function (_x106, _x107, _x108) {
    return _ref36.apply(this, arguments);
  };
}());
router.get('/dashboard/visual', _auth["default"], _install["default"].redirectToLogin, (0, _role["default"])('admin'), /*#__PURE__*/function () {
  var _ref37 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee37(req, res, next) {
    return _regenerator["default"].wrap(function _callee37$(_context37) {
      while (1) {
        switch (_context37.prev = _context37.next) {
          case 0:
            res.render('./admin/visual', {
              title: 'Visual Settings'
            });

          case 1:
          case "end":
            return _context37.stop();
        }
      }
    }, _callee37);
  }));

  return function (_x109, _x110, _x111) {
    return _ref37.apply(this, arguments);
  };
}());
router.get('/dashboard/menu', _auth["default"], _install["default"].redirectToLogin, (0, _role["default"])('admin'), /*#__PURE__*/function () {
  var _ref38 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee38(req, res, next) {
    var menu, adminCat, adminPage, adminTag, adminAuthor;
    return _regenerator["default"].wrap(function _callee38$(_context38) {
      while (1) {
        switch (_context38.prev = _context38.next) {
          case 0:
            _context38.next = 2;
            return _menu["default"].find().sort({
              position: 1
            });

          case 2:
            menu = _context38.sent;
            _context38.next = 5;
            return _category["default"].find().sort({
              createdAt: -1
            });

          case 5:
            adminCat = _context38.sent;
            _context38.next = 8;
            return _pages["default"].find().sort({
              createdAt: -1
            });

          case 8:
            adminPage = _context38.sent;
            _context38.next = 11;
            return _tags["default"].find().sort({
              createdAt: -1
            });

          case 11:
            adminTag = _context38.sent;
            _context38.next = 14;
            return _users["default"].find().sort({
              createdAt: -1
            });

          case 14:
            adminAuthor = _context38.sent;
            res.render('./admin/menu', {
              title: 'Menu',
              menu: menu,
              adminCat: adminCat,
              adminPage: adminPage,
              adminTag: adminTag,
              adminAuthor: adminAuthor
            });

          case 16:
          case "end":
            return _context38.stop();
        }
      }
    }, _callee38);
  }));

  return function (_x112, _x113, _x114) {
    return _ref38.apply(this, arguments);
  };
}());
module.exports = router;