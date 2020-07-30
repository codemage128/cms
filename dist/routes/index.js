"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _articles = _interopRequireDefault(require("../models/articles"));

var _category = _interopRequireDefault(require("../models/category"));

var _settings = _interopRequireDefault(require("../models/settings"));

var _comment = _interopRequireDefault(require("../models/comment"));

var _tags = _interopRequireDefault(require("../models/tags"));

var _expressFlash = _interopRequireDefault(require("express-flash"));

var _moment = _interopRequireDefault(require("moment"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _users = _interopRequireDefault(require("../models/users"));

var _url = _interopRequireDefault(require("url"));

var _ads = _interopRequireDefault(require("../models/ads"));

var _install = _interopRequireDefault(require("../helpers/install"));

var _menu = _interopRequireDefault(require("../models/menu"));

var router = _express["default"].Router();

_dotenv["default"].config({
  path: './.env'
});

router.use((0, _expressFlash["default"])());
router.use( /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var settingsInfo;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _settings["default"].find({});

          case 2:
            settingsInfo = _context.sent;
            _context.next = 5;
            return _menu["default"].find().sort({
              position: 1
            });

          case 5:
            res.locals.mainMenu = _context.sent;

            res.locals.time = function (ev) {
              var wordsPerMinute = 200; // Average case.

              var result;
              var textLength = ev.split(/\s/g).length; // Split by words

              if (textLength > 0) {
                var value = Math.ceil(textLength / wordsPerMinute);
                result = "".concat(value, " min read");
              }

              return result;
            };

            res.locals.getmonth = function (data) {
              switch (data) {
                case 0:
                  return 'Jan';
                  break;

                case 1:
                  return 'Feb';
                  break;

                case 2:
                  return 'March';
                  break;

                case 3:
                  return 'Apr';
                  break;

                case 4:
                  return 'May';
                  break;

                case 5:
                  return 'Jun';
                  break;

                case 6:
                  return 'Jul';
                  break;

                case 7:
                  return 'Aug';
                  break;

                case 8:
                  return 'Sep';
                  break;

                case 9:
                  return 'Oct';
                  break;

                case 10:
                  return 'Nov';
                  break;

                case 11:
                  return 'Dec';
                  break;

                default:
                  break;
              }
            };

            res.locals.success_msg = req.flash('success_msg');
            res.locals.error_msg = req.flash('error_msg');
            res.locals.error = req.flash('error');
            res.locals.user = req.user || null;
            res.locals.siteTitle = settingsInfo == '' ? 'Pls edit site title in the admin dashboard' : typeof settingsInfo[0].siteName == 'undefined' ? 'Pls edit site title in the admin dashboard' : "".concat(settingsInfo[0].siteName);
            res.locals.siteDescription = settingsInfo == '' ? 'Edit site description in the admin dashboard' : typeof settingsInfo[0].siteDescription == 'undefined' ? 'edit site title in the admin dashboard' : "".concat(settingsInfo[0].siteDescription);
            _context.next = 16;
            return _articles["default"].find({
              slug: {
                $ne: _url["default"].parse(req.url).path.split('/').pop()
              }
            }).populate('category').populate('postedBy').sort({
              createdAt: -1
            }).limit(5);

          case 16:
            res.locals.recent = _context.sent;
            _context.next = 19;
            return _articles["default"].find({
              slug: {
                $ne: _url["default"].parse(req.url).path.split('/').pop()
              }
            }).populate('category').populate('postedBy').sort({
              views: -1
            }).limit(5);

          case 19:
            res.locals.sidebarPop = _context.sent;
            _context.next = 22;
            return _comment["default"].aggregate([{
              $lookup: {
                from: 'articles',
                localField: 'articleId',
                foreignField: '_id',
                as: 'article'
              }
            }, {
              $unwind: {
                path: '$article',
                preserveNullAndEmptyArrays: true
              }
            }, {
              $lookup: {
                from: 'users',
                localField: 'article.postedBy',
                foreignField: '_id',
                as: 'postedBy'
              }
            }, {
              $unwind: {
                path: '$postedBy',
                preserveNullAndEmptyArrays: true
              }
            }, {
              $lookup: {
                from: 'categories',
                localField: 'article.category',
                foreignField: '_id',
                as: 'category'
              }
            }, {
              $unwind: {
                path: '$category',
                preserveNullAndEmptyArrays: true
              }
            }, {
              $sort: {
                createdAt: -1
              }
            }, {
              $limit: 5
            }]);

          case 22:
            res.locals.comments = _context.sent;
            _context.next = 25;
            return _tags["default"].find().sort({
              createdAt: -1
            }).limit(12);

          case 25:
            res.locals.tags = _context.sent;
            _context.next = 28;
            return _tags["default"].find().sort({
              createdAt: -1
            });

          case 28:
            res.locals.tags2 = _context.sent;
            _context.next = 31;
            return _category["default"].aggregate([{
              $sort: {
                createdAt: -1
              }
            }, {
              $limit: 7
            }, {
              $lookup: {
                from: 'articles',
                localField: '_id',
                foreignField: 'category',
                as: 'total'
              }
            }]);

          case 31:
            res.locals.category = _context.sent;
            _context.next = 34;
            return _category["default"].aggregate([{
              $limit: 7
            }, {
              $lookup: {
                from: 'articles',
                localField: '_id',
                foreignField: 'category',
                as: 'total'
              }
            }, {
              $sort: {
                total: -1
              }
            }]);

          case 34:
            res.locals.hotCategory = _context.sent;
            _context.next = 37;
            return _category["default"].aggregate([{
              $sort: {
                createdAt: -1
              }
            }, {
              $lookup: {
                from: 'articles',
                localField: '_id',
                foreignField: 'category',
                as: 'total'
              }
            }]);

          case 37:
            res.locals.category2 = _context.sent;
            _context.next = 40;
            return _category["default"].aggregate([{
              $match: {
                parent: {
                  $exists: false
                }
              }
            }, {
              $sort: {
                createdAt: -1
              }
            }]);

          case 40:
            res.locals.subCategory2 = _context.sent;
            _context.next = 43;
            return _category["default"].aggregate([{
              $match: {
                parent: {
                  $exists: true
                }
              }
            }, {
              $sort: {
                createdAt: -1
              }
            }]);

          case 43:
            res.locals.subCategory = _context.sent;

            res.locals.formatDate = function (arg) {
              return (0, _moment["default"])(arg).fromNow();
            };

            res.locals.strip = function (stringWithHTML) {
              var text = stringWithHTML.replace(/<!--[\s\S]*?(-->|$)/g, '').replace(/<(script|style)[^>]*>[\s\S]*?(<\/\1>|$)/gi, '').replace(/<\/?[a-z][\s\S]*?(>|$)/gi, '');
              return text;
            };

            res.locals.siteLink = "".concat(req.protocol, "://").concat(req.headers.host);
            res.locals.facebook = settingsInfo == '' ? 'https://facebook.com' : typeof settingsInfo[0].socialMedia.facebook == 'undefined' ? 'https://facebook.com' : "".concat(settingsInfo[0].socialMedia.facebook);
            res.locals.twitter = settingsInfo == '' ? 'https://twitter.com' : typeof settingsInfo[0].socialMedia.twitter == 'undefined' ? 'https://twitter.com' : "".concat(settingsInfo[0].socialMedia.twitter);
            res.locals.instagram = settingsInfo == '' ? 'https://instagram.com' : typeof settingsInfo[0].socialMedia.instagram == 'undefined' ? 'https://instagram.com' : "".concat(settingsInfo[0].socialMedia.instagram);
            res.locals.linkedin = settingsInfo == '' ? 'https://linkedin.com' : typeof settingsInfo[0].socialMedia.linkedin == 'undefined' ? 'https://linkedin.com' : "".concat(settingsInfo[0].socialMedia.linkedin);
            res.locals.youtube = settingsInfo == '' ? 'https://youtube.com' : typeof settingsInfo[0].socialMedia.youtube == 'undefined' ? 'https://youtube.com' : "".concat(settingsInfo[0].socialMedia.youtube);
            res.locals.pinterest = settingsInfo == '' ? 'https://pinterest.com' : typeof settingsInfo[0].socialMedia.pinterest == 'undefined' ? 'https://pinterest.com' : "".concat(settingsInfo[0].socialMedia.pinterest);
            res.locals.textAsIcon = settingsInfo == '' ? false : settingsInfo[0].textAsIcon;
            res.locals.siteLogo = settingsInfo == '' ? 'default.png' : typeof settingsInfo[0].siteLogo == 'undefined' ? 'default.png' : settingsInfo[0].siteLogo;
            res.locals.favicon = settingsInfo == '' ? 'default.png' : typeof settingsInfo[0].favicon == 'undefined' ? 'default.png' : settingsInfo[0].favicon;
            res.locals.siteEmail = settingsInfo == '' ? 'update site email in the admin dashboard' : typeof settingsInfo[0].contactInfo.email == 'undefined' ? 'update site email in the admin dashboard' : settingsInfo[0].contactInfo.email;
            res.locals.siteNumber = settingsInfo == '' ? 'update Phone number in the admin dashboard' : typeof settingsInfo[0].contactInfo.phoneNumber == 'undefined' ? 'update phone number in the admin dashboard' : settingsInfo[0].contactInfo.phoneNumber;
            res.locals.otherInfo = settingsInfo == '' ? 'update this in the admin dashboard' : typeof settingsInfo[0].contactInfo.otherInfo == 'undefined' ? 'update this in the admin dashboard' : settingsInfo[0].contactInfo.otherInfo;
            _context.next = 61;
            return _category["default"].find().populate('parent').sort({
              createdAt: -1
            }).limit(3);

          case 61:
            res.locals.headerCategory = _context.sent;
            res.locals.operatingSystem = process.platform;

            if (!(typeof req.user !== 'undefined')) {
              _context.next = 69;
              break;
            }

            _context.next = 66;
            return _articles["default"].countDocuments({
              postedBy: req.user.id
            });

          case 66:
            _context.t0 = _context.sent;
            _context.next = 70;
            break;

          case 69:
            _context.t0 = null;

          case 70:
            res.locals.myPost = _context.t0;
            res.locals.copyright = settingsInfo == '' ? "Copright ".concat(new Date().getFullYear()) : settingsInfo[0].copyright;
            res.locals.mainSettings = settingsInfo[0];
            _context.next = 75;
            return _ads["default"].find({
              location: 'homepageFooter'
            }).sort({
              createdAt: -1
            });

          case 75:
            res.locals.homepageFooter = _context.sent;
            _context.next = 78;
            return _ads["default"].find({
              location: 'homepageSidebar'
            }).sort({
              createdAt: -1
            });

          case 78:
            res.locals.homepageSidebar = _context.sent;
            _context.next = 81;
            return _ads["default"].find({
              location: 'categoryFooter'
            }).sort({
              createdAt: -1
            });

          case 81:
            res.locals.categoryFooter = _context.sent;
            _context.next = 84;
            return _ads["default"].find({
              location: 'authorFooter'
            }).sort({
              createdAt: -1
            });

          case 84:
            res.locals.authorFooter = _context.sent;
            _context.next = 87;
            return _ads["default"].find({
              location: 'searchFooter'
            }).sort({
              createdAt: -1
            });

          case 87:
            res.locals.searchFooter = _context.sent;

            res.locals.getCat = function (arg) {
              var promise = new Promise(function (resolve, reject) {
                resolve(_category["default"].findOne({
                  slug: arg.split('/').pop()
                }));
              });
              return promise.then(function (data) {
                return data.name;
              });
            };

            next();

          case 90:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}()); // Disable post request in the demo
// router.post('*', (req, res, next) => {
// 	if (req.path == '/login') {
// 		return next();
// 	} else {
// 		req.flash('success_msg', 'Post request is disabled in demo');
// 		return res.redirect('back');
// 	}
// });
// Get index page

router.get('/', _install["default"].redirectToLogin, /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var perPage, page, slider1, featured, post, count, popularNews, popNews, img, recommended, breakingNews, video;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            perPage = 9;
            page = req.query.page || 1;
            _context2.next = 5;
            return _articles["default"].aggregate([{
              $match: {
                showPostOnSlider: true,
                active: true
              }
            }, {
              $lookup: {
                from: 'categories',
                localField: 'category',
                foreignField: '_id',
                as: 'category'
              }
            }, {
              $unwind: {
                path: '$category',
                preserveNullAndEmptyArrays: true
              }
            }, {
              $lookup: {
                from: 'users',
                localField: 'postedBy',
                foreignField: '_id',
                as: 'postedBy'
              }
            }, {
              $unwind: {
                path: '$postedBy',
                preserveNullAndEmptyArrays: true
              }
            }, {
              $lookup: {
                from: 'comments',
                localField: '_id',
                foreignField: 'articleId',
                as: 'comments'
              }
            }, {
              $sort: {
                createdAt: -1
              }
            }, {
              $limit: 4
            }]);

          case 5:
            slider1 = _context2.sent;
            _context2.next = 8;
            return _articles["default"].aggregate([{
              $match: {
                addToFeatured: true,
                active: true
              }
            }, {
              $lookup: {
                from: 'categories',
                localField: 'category',
                foreignField: '_id',
                as: 'category'
              }
            }, {
              $unwind: {
                path: '$category',
                preserveNullAndEmptyArrays: true
              }
            }, {
              $lookup: {
                from: 'users',
                localField: 'postedBy',
                foreignField: '_id',
                as: 'postedBy'
              }
            }, {
              $unwind: {
                path: '$postedBy',
                preserveNullAndEmptyArrays: true
              }
            }, {
              $lookup: {
                from: 'comments',
                localField: '_id',
                foreignField: 'articleId',
                as: 'comments'
              }
            }, {
              $sort: {
                createdAt: -1
              }
            }, {
              $limit: 4
            }]);

          case 8:
            featured = _context2.sent;
            _context2.next = 11;
            return _articles["default"].find({
              active: true
            }).populate('postedBy').populate('category').sort({
              createdAt: -1
            }).skip(perPage * page - perPage).limit(perPage);

          case 11:
            post = _context2.sent;
            _context2.next = 14;
            return _articles["default"].countDocuments({
              active: true
            });

          case 14:
            count = _context2.sent;
            _context2.next = 17;
            return _articles["default"].find({
              active: true
            }).sort({
              views: -1
            }).populate('category').populate('postedBy').limit(1);

          case 17:
            popularNews = _context2.sent;
            _context2.next = 20;
            return _articles["default"].find({
              active: true
            }).sort({
              views: -1
            }).populate('category').limit(3);

          case 20:
            popNews = _context2.sent;
            _context2.next = 23;
            return _articles["default"].find({
              active: true
            }).sort({
              createdAt: -1
            }).limit(12);

          case 23:
            img = _context2.sent;
            _context2.next = 26;
            return _articles["default"].find({
              active: true,
              addToRecommended: true
            }).populate('category').populate('postedBy').sort({
              createdAt: -1
            }).limit(4);

          case 26:
            recommended = _context2.sent;
            _context2.next = 29;
            return _articles["default"].find({
              active: true,
              addToBreaking: true
            }).populate('category').populate('postedBy').sort({
              createdAt: -1
            }).limit(4);

          case 29:
            breakingNews = _context2.sent;
            _context2.next = 32;
            return _articles["default"].aggregate([{
              $match: {
                postType: 'video',
                active: true
              }
            }, {
              $lookup: {
                from: 'categories',
                localField: 'category',
                foreignField: '_id',
                as: 'category'
              }
            }, {
              $unwind: {
                path: '$category',
                preserveNullAndEmptyArrays: true
              }
            }, {
              $lookup: {
                from: 'users',
                localField: 'postedBy',
                foreignField: '_id',
                as: 'postedBy'
              }
            }, {
              $unwind: {
                path: '$postedBy',
                preserveNullAndEmptyArrays: true
              }
            }, {
              $lookup: {
                from: 'comments',
                localField: '_id',
                foreignField: 'articleId',
                as: 'comments'
              }
            }, {
              $sort: {
                createdAt: -1
              }
            }, {
              $limit: 12
            }]);

          case 32:
            video = _context2.sent;
            res.render('index', {
              post: post,
              current: page,
              pages: Math.ceil(count / perPage),
              slider1: slider1,
              popular: popularNews[0],
              popNews: popNews,
              img: img,
              breakingNews: breakingNews,
              featured: featured,
              video: video,
              recommended: recommended
            });
            _context2.next = 39;
            break;

          case 36:
            _context2.prev = 36;
            _context2.t0 = _context2["catch"](0);
            next(_context2.t0);

          case 39:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 36]]);
  }));

  return function (_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}()); // Get search page

router.get('/search', _install["default"].redirectToLogin, /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var perPage, page, count, data, random;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;

            if (!req.query.q) {
              _context3.next = 16;
              break;
            }

            perPage = 9;
            page = req.query.page || 1;
            _context3.next = 6;
            return _articles["default"].countDocuments({
              active: true,
              $or: [{
                title: {
                  $regex: req.query.q,
                  $options: '$i'
                }
              }, {
                tags: {
                  $regex: req.query.q,
                  $options: '$i'
                }
              }]
            });

          case 6:
            count = _context3.sent;
            _context3.next = 9;
            return _articles["default"].find({
              active: true,
              $or: [{
                title: {
                  $regex: req.query.q,
                  $options: '$i'
                }
              }, {
                tags: {
                  $regex: req.query.q,
                  $options: '$i'
                }
              }]
            }).populate('postedBy').populate('category').skip(perPage * page - perPage).limit(perPage).sort({
              createdAt: -1
            });

          case 9:
            data = _context3.sent;
            _context3.next = 12;
            return _articles["default"].aggregate([{
              $match: {
                active: true
              }
            }, {
              $sample: {
                size: 4
              }
            }, {
              $lookup: {
                from: 'users',
                localField: 'postedBy',
                foreignField: '_id',
                as: 'postedBy'
              }
            }, {
              $unwind: '$postedBy'
            }, {
              $lookup: {
                from: 'categories',
                localField: 'category',
                foreignField: '_id',
                as: 'category'
              }
            }, {
              $unwind: '$category'
            }]);

          case 12:
            random = _context3.sent;
            res.render('search', {
              data: data,
              search: req.query.q,
              current: page,
              pages: Math.ceil(count / perPage),
              random: random
            });
            _context3.next = 17;
            break;

          case 16:
            res.render('404');

          case 17:
            _context3.next = 22;
            break;

          case 19:
            _context3.prev = 19;
            _context3.t0 = _context3["catch"](0);
            next(_context3.t0);

          case 22:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 19]]);
  }));

  return function (_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}());
router.get('/author/:username', _install["default"].redirectToLogin, /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    var user, featured, perPage, page, article, count;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return _users["default"].findOne({
              username: req.params.username
            });

          case 2:
            user = _context4.sent;
            _context4.next = 5;
            return _articles["default"].aggregate([{
              $match: {
                addToFeatured: true,
                active: true
              }
            }, {
              $lookup: {
                from: 'categories',
                localField: 'category',
                foreignField: '_id',
                as: 'category'
              }
            }, {
              $unwind: {
                path: '$category',
                preserveNullAndEmptyArrays: true
              }
            }, {
              $lookup: {
                from: 'users',
                localField: 'postedBy',
                foreignField: '_id',
                as: 'postedBy'
              }
            }, {
              $unwind: {
                path: '$postedBy',
                preserveNullAndEmptyArrays: true
              }
            }, {
              $lookup: {
                from: 'comments',
                localField: '_id',
                foreignField: 'articleId',
                as: 'comments'
              }
            }, {
              $sort: {
                createdAt: -1
              }
            }, {
              $limit: 4
            }]);

          case 5:
            featured = _context4.sent;

            if (user) {
              _context4.next = 10;
              break;
            }

            res.render('404');
            _context4.next = 19;
            break;

          case 10:
            perPage = 9;
            page = req.query.page || 1;
            _context4.next = 14;
            return _articles["default"].find({
              active: true,
              postedBy: user._id
            }).populate('postedBy').populate('category').skip(perPage * page - perPage).limit(perPage).sort({
              createdAt: -1
            });

          case 14:
            article = _context4.sent;
            _context4.next = 17;
            return _articles["default"].countDocuments({
              active: true,
              postedBy: user._id
            });

          case 17:
            count = _context4.sent;
            res.render('author', {
              author: user,
              article: article,
              featured: featured,
              current: page,
              pages: Math.ceil(count / perPage)
            });

          case 19:
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
module.exports = router;