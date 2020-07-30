"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _articles = _interopRequireDefault(require("../models/articles"));

var _auth = _interopRequireDefault(require("../helpers/auth"));

var _role = _interopRequireDefault(require("../helpers/role"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _category = _interopRequireDefault(require("../models/category"));

var _users = _interopRequireDefault(require("../models/users"));

var _bookmark = _interopRequireDefault(require("../models/bookmark"));

var router = _express["default"].Router();

router.get("/user/dashboard", _auth["default"], (0, _role["default"])("admin", "user"), /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var totalPost, pendingPost;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return _articles["default"].countDocuments({
              postedBy: req.user.id
            });

          case 3:
            totalPost = _context.sent;
            _context.next = 6;
            return _articles["default"].countDocuments({
              postedBy: req.user.id,
              active: false
            });

          case 6:
            pendingPost = _context.sent;
            res.render("./user/index", {
              title: "Dashboard",
              totalPost: totalPost,
              pendingPost: pendingPost
            });
            _context.next = 13;
            break;

          case 10:
            _context.prev = 10;
            _context.t0 = _context["catch"](0);
            next(_context.t0);

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 10]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());
router.get("/user/posts/add-new", _auth["default"], (0, _role["default"])("admin", "user"), /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            try {
              res.render("./user/add-new-post", {
                title: "Article - Add new post"
              });
            } catch (error) {
              next(error);
            }

          case 1:
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
router.get("/user/posts/add-new-audio", _auth["default"], (0, _role["default"])("admin", "user"), /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            res.render("./user/add-new-audio", {
              title: "Audio - Add new Audio"
            });

          case 1:
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
router.get("/user/posts/add-new-video", _auth["default"], (0, _role["default"])("admin", "user"), /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            res.render("./user/add-new-video", {
              title: "Video - Add new Video"
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
router.get("/user/all-posts", _auth["default"], (0, _role["default"])("admin", "user"), /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    var perPage, page, category, article, coun, count, _perPage, _page, _article, _coun, _count, _perPage2, _page2, _article2, _count2;

    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            if (!req.query.category) {
              _context5.next = 16;
              break;
            }

            perPage = 10;
            page = req.query.page || 1;
            _context5.next = 5;
            return _category["default"].findOne({
              name: req.query.category
            });

          case 5:
            category = _context5.sent;
            _context5.next = 8;
            return _articles["default"].aggregate([{
              $match: {
                postedBy: _mongoose["default"].Types.ObjectId(req.user.id),
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
            article = _context5.sent;
            _context5.next = 11;
            return _articles["default"].aggregate([{
              $match: {
                postedBy: _mongoose["default"].Types.ObjectId(req.user.id),
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
            coun = _context5.sent;
            count = coun.length;
            res.render("./user/all-post", {
              title: "Dashboard - All Posts",
              article: article,
              current: page,
              pages: Math.ceil(count / perPage),
              query: "yes",
              searchName: req.query.category
            });
            _context5.next = 38;
            break;

          case 16:
            if (!req.query.q) {
              _context5.next = 29;
              break;
            }

            _perPage = 10;
            _page = req.query.page || 1;
            _context5.next = 21;
            return _articles["default"].aggregate([{
              $match: {
                postedBy: _mongoose["default"].Types.ObjectId(req.user.id),
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
            _article = _context5.sent;
            _context5.next = 24;
            return _articles["default"].aggregate([{
              $match: {
                postedBy: _mongoose["default"].Types.ObjectId(req.user.id),
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
            _coun = _context5.sent;
            _count = _coun.length;
            res.render("./user/all-post", {
              title: "Dashboard - All Posts",
              article: _article,
              current: _page,
              pages: Math.ceil(_count / _perPage),
              query: true,
              searchName: req.query.q
            });
            _context5.next = 38;
            break;

          case 29:
            _perPage2 = 10;
            _page2 = req.query.page || 1;
            _context5.next = 33;
            return _articles["default"].aggregate([{
              $match: {
                postedBy: _mongoose["default"].Types.ObjectId(req.user.id)
              }
            }, {
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
            _article2 = _context5.sent;
            _context5.next = 36;
            return _articles["default"].countDocuments({
              postedBy: req.user.id
            });

          case 36:
            _count2 = _context5.sent;
            res.render("./user/all-post", {
              title: "All Posts",
              article: _article2,
              current: _page2,
              pages: Math.ceil(_count2 / _perPage2),
              query: "no"
            });

          case 38:
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
router.get("/user/all-posts/edit/:slug", _auth["default"], (0, _role["default"])("admin", "user"), /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res, next) {
    var article;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            _context6.next = 3;
            return _articles["default"].findOne({
              postedBy: req.user.id,
              slug: req.params.slug
            }).populate("category");

          case 3:
            article = _context6.sent;
            if (!article) res.render("404");
            _context6.t0 = article.postType;
            _context6.next = _context6.t0 === "post" ? 8 : _context6.t0 === "audio" ? 10 : _context6.t0 === "video" ? 12 : 14;
            break;

          case 8:
            res.render("./user/edit-post", {
              title: "Edit Post - ".concat(article.title),
              article: article
            });
            return _context6.abrupt("break", 15);

          case 10:
            res.render("./user/edit-audio", {
              title: "Edit Audio - ".concat(article.title),
              article: article
            });
            return _context6.abrupt("break", 15);

          case 12:
            res.render("./user/edit-video", {
              title: "Edit Video - ".concat(article.title),
              article: article
            });
            return _context6.abrupt("break", 15);

          case 14:
            return _context6.abrupt("break", 15);

          case 15:
            _context6.next = 20;
            break;

          case 17:
            _context6.prev = 17;
            _context6.t1 = _context6["catch"](0);
            next(_context6.t1);

          case 20:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[0, 17]]);
  }));

  return function (_x16, _x17, _x18) {
    return _ref6.apply(this, arguments);
  };
}());
router.get("/user/pending-posts", _auth["default"], (0, _role["default"])("admin", "user"), /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res, next) {
    var perPage, page, category, article, coun, count, _perPage3, _page3, _article3, _coun2, _count3, _perPage4, _page4, _article4, _count4;

    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            if (!req.query.category) {
              _context7.next = 16;
              break;
            }

            perPage = 10;
            page = req.query.page || 1;
            _context7.next = 5;
            return _category["default"].findOne({
              name: req.query.category
            });

          case 5:
            category = _context7.sent;
            _context7.next = 8;
            return _articles["default"].aggregate([{
              $match: {
                active: false,
                postedBy: _mongoose["default"].Types.ObjectId(req.user.id),
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
            article = _context7.sent;
            _context7.next = 11;
            return _articles["default"].aggregate([{
              $match: {
                active: false,
                postedBy: _mongoose["default"].Types.ObjectId(req.user.id),
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
            coun = _context7.sent;
            count = coun.length;
            res.render("./user/pending-post", {
              title: "Pending Posts",
              article: article,
              current: page,
              pages: Math.ceil(count / perPage),
              query: "yes",
              searchName: req.query.category
            });
            _context7.next = 38;
            break;

          case 16:
            if (!req.query.q) {
              _context7.next = 29;
              break;
            }

            _perPage3 = 10;
            _page3 = req.query.page || 1;
            _context7.next = 21;
            return _articles["default"].aggregate([{
              $match: {
                active: false,
                postedBy: _mongoose["default"].Types.ObjectId(req.user.id),
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
              $skip: _perPage3 * _page3 - _perPage3
            }, {
              $limit: _perPage3
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
            _article3 = _context7.sent;
            _context7.next = 24;
            return _articles["default"].aggregate([{
              $match: {
                active: false,
                postedBy: _mongoose["default"].Types.ObjectId(req.user.id),
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
            _coun2 = _context7.sent;
            _count3 = _coun2.length;
            res.render("./user/pending-post", {
              title: "Pending Posts",
              article: _article3,
              current: _page3,
              pages: Math.ceil(_count3 / _perPage3),
              query: true,
              searchName: req.query.q
            });
            _context7.next = 38;
            break;

          case 29:
            _perPage4 = 10;
            _page4 = req.query.page || 1;
            _context7.next = 33;
            return _articles["default"].aggregate([{
              $match: {
                active: false,
                postedBy: _mongoose["default"].Types.ObjectId(req.user.id)
              }
            }, {
              $sort: {
                createdAt: -1
              }
            }, {
              $skip: _perPage4 * _page4 - _perPage4
            }, {
              $limit: _perPage4
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
            _article4 = _context7.sent;
            _context7.next = 36;
            return _articles["default"].countDocuments({
              active: false,
              postedBy: req.user.id
            });

          case 36:
            _count4 = _context7.sent;
            res.render("./user/pending-post", {
              title: "Pending Posts",
              article: _article4,
              current: _page4,
              pages: Math.ceil(_count4 / _perPage4),
              query: "no"
            });

          case 38:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function (_x19, _x20, _x21) {
    return _ref7.apply(this, arguments);
  };
}());
router.get("/user/profile", _auth["default"], (0, _role["default"])("admin", "user"), function (req, res, next) {
  res.render("./user/profile", {
    title: "My Profile"
  });
});
router.get("/user/followers", _auth["default"], (0, _role["default"])("admin", "user"), /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res, next) {
    var followers;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return _users["default"].find({
              following: {
                $in: req.user.id
              }
            }).populate("following").sort({
              createdAt: -1
            });

          case 2:
            followers = _context8.sent;
            res.render("./user/followers", {
              title: "My Followers",
              followers: followers
            });

          case 4:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));

  return function (_x22, _x23, _x24) {
    return _ref8.apply(this, arguments);
  };
}());
router.get("/user/following", _auth["default"], (0, _role["default"])("admin", "user"), /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(req, res, next) {
    var following;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return _users["default"].findById(req.user.id).populate("following").sort({
              createdAt: -1
            });

          case 2:
            following = _context9.sent;
            res.render("./user/following", {
              title: "Following",
              following: following
            });

          case 4:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));

  return function (_x25, _x26, _x27) {
    return _ref9.apply(this, arguments);
  };
}());
router.get("/user/bookmarks", _auth["default"], (0, _role["default"])("admin", "user"), /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(req, res, next) {
    var bookmark;
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.next = 2;
            return _bookmark["default"].find({
              userId: req.user.id
            }).populate({
              path: "articleId",
              populate: {
                path: "postedBy category"
              }
            }).sort({
              createdAt: -1
            });

          case 2:
            bookmark = _context10.sent;
            res.render("./user/bookmark", {
              title: "Reading List",
              bookmark: bookmark
            });

          case 4:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  }));

  return function (_x28, _x29, _x30) {
    return _ref10.apply(this, arguments);
  };
}());
module.exports = router;