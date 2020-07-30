"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _newsletter = _interopRequireDefault(require("../models/newsletter"));

var _mail2 = _interopRequireDefault(require("../helpers/_mail"));

var _role = _interopRequireDefault(require("../helpers/role"));

var _articles = _interopRequireDefault(require("../models/articles"));

var _auth = _interopRequireDefault(require("../helpers/auth"));

var _nodeCron = _interopRequireDefault(require("node-cron"));

var _moment = _interopRequireDefault(require("moment"));

var router = _express["default"].Router(); // Subscribe to newsletter


router.post("/newsletter", /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var exist, errors, payload, subscribeUser;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return _newsletter["default"].find({
              email: req.body.email
            });

          case 3:
            exist = _context.sent;

            if (!(exist == "")) {
              _context.next = 21;
              break;
            }

            req.assert("email", "Email Field cannot be blank").notEmpty();
            req.assert("email", "Email is invalid").isEmail();
            req.assert("firstname", "First Name cannot be empty").notEmpty();
            req.assert("lastname", "Last name cannot be empty").notEmpty();
            req.sanitize("email").normalizeEmail({
              gmail_remove_dots: false
            });
            errors = req.validationErrors();

            if (!errors) {
              _context.next = 16;
              break;
            }

            req.flash("success_msg", "".concat(errors[0].msg));
            return _context.abrupt("return", res.redirect("back"));

          case 16:
            payload = {
              email: req.body.email.trim(),
              firstname: req.body.firstname.trim(),
              lastname: req.body.lastname.trim(),
              host: "".concat(req.protocol, "://").concat(req.headers.host),
              logo: res.locals.siteLogo,
              instagram: res.locals.instagram,
              facebook: res.locals.facebook,
              twitter: res.locals.twitter,
              siteLink: res.locals.siteLink,
              newsletterType: req.body.newsletterType ? req.body.newsletterType : "weekly"
            };
            subscribeUser = new _newsletter["default"](payload);
            subscribeUser.save().then(function (subscribed) {
              (0, _mail2["default"])("Thanks for subscribing to our newsletter", payload.email, "subscription", payload, req.headers.host, function (err, info) {
                if (err) console.log(err);
              });
              req.flash("success_msg", "Thanks for subscribing to our newsletter");
              return res.redirect("back");
            })["catch"](function (e) {
              return next(e);
            });

          case 19:
            _context.next = 23;
            break;

          case 21:
            req.flash("success_msg", "Your email exist in our subscription list, Don't worry you are safe.");
            return _context.abrupt("return", res.redirect("back"));

          case 23:
            _context.next = 28;
            break;

          case 25:
            _context.prev = 25;
            _context.t0 = _context["catch"](0);
            next(_context.t0);

          case 28:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 25]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}()); // Unsubscribe from newsletter

router.get("/newsletter/unsubscribe", function (req, res, next) {
  try {
    if (!req.query.email) res.render("404");else {
      _newsletter["default"].findOne({
        email: req.query.email
      }).then(function (info) {
        var payload = {
          email: info.email,
          firstname: info.firstname,
          lastname: info.lastname,
          host: "".concat(req.protocol, "://").concat(req.headers.host),
          logo: res.locals.siteLogo,
          instagram: res.locals.instagram,
          facebook: res.locals.facebook,
          twitter: res.locals.twitter,
          siteLink: res.locals.siteLink
        };

        _newsletter["default"].deleteOne({
          email: req.query.email
        }).then(function (deleted) {
          (0, _mail2["default"])("Unsubscribed Successfully", req.query.email, "unsubscribe", payload, req.headers.host, function (info, err) {
            console.log(info.response);
          });
          req.flash("success_msg", "You have unsubscribed from our newsletter, we are so sorry to see you go");
          return res.redirect("/");
        })["catch"](function (e) {
          return next(e);
        });
      })["catch"](function (e) {
        return next(e);
      });
    }
  } catch (error) {
    next(error);
  }
}); // update newsletter

router.post("/newsletter/edit", _auth["default"], (0, _role["default"])("admin"), function (req, res, next) {
  try {
    _newsletter["default"].updateOne({
      _id: req.body.emailId
    }, req.body).then(function (updated) {
      req.flash("success_msg", "Subscriber Info has been Updated");
      return res.redirect("back");
    })["catch"](function (e) {
      return next(e);
    });
  } catch (error) {
    next(error);
  }
}); // Delete Many

router.post("/newsletter/deleteMany", _auth["default"], (0, _role["default"])("admin"), function (req, res, next) {
  try {
    _newsletter["default"].deleteMany({
      _id: req.body.ids
    }).then(function (deleted) {
      if (!req.body.ids) {
        req.flash("success_msg", "Nothing Was Deleted");
        return res.redirect("back");
      } else {
        req.flash("success_msg", "Subscriber Deleted successfully");
        return res.redirect("back");
      }
    })["catch"](function (e) {
      return next(e);
    });
  } catch (error) {
    next(error);
  }
}); // Send email to subscribers

router.post("/newsletter/compose", _auth["default"], (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var users, payload;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _newsletter["default"].find();

          case 2:
            users = _context2.sent;
            payload = {
              message: req.body.message,
              subject: req.body.subject,
              logo: res.locals.siteLogo,
              instagram: res.locals.instagram,
              facebook: res.locals.facebook,
              twitter: res.locals.twitter,
              username: req.user.username,
              role: req.user.roleId,
              at: res.locals.siteTitle,
              profilePicture: req.user.profilePicture,
              siteLink: res.locals.siteLink
            };
            users.map(function (user) {
              (0, _mail2["default"])(req.body.subject, user.email, "general-email", payload, req.headers.host, function (err, info) {
                if (err) console.log(err);
              });
            });
            req.flash("success_msg", "Email Sent Successfully");
            return _context2.abrupt("return", res.redirect("back"));

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}()); // Switch newsletter type e.g daily to weekly or monthly

router.post("/newsletter/switch", /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return _newsletter["default"].updateOne({
              email: req.body.email
            }, {
              newsletterType: req.body.newsletterType
            });

          case 2:
            req.flash("success_msg", "Newsletter Status has been updated successfully");
            return _context3.abrupt("return", res.redirect("back"));

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}()); // Send weekly newsletter

function sendWeeklyEmails() {
  return _sendWeeklyEmails.apply(this, arguments);
} // Let cron job send the newsletter 7 of every saturday morning


function _sendWeeklyEmails() {
  _sendWeeklyEmails = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            _context5.next = 3;
            return _newsletter["default"].find({}).then(function (info) {
              Array.prototype.forEach.call(info, /*#__PURE__*/function () {
                var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(inf) {
                  return _regenerator["default"].wrap(function _callee4$(_context4) {
                    while (1) {
                      switch (_context4.prev = _context4.next) {
                        case 0:
                          _context4.next = 2;
                          return _articles["default"].find({}).sort({
                            createdAt: -1
                          }).limit(5).then(function (article) {
                            var payload = {
                              email: inf.email,
                              firstname: inf.firstname,
                              lastname: inf.lastname
                            };
                            (0, _mail2["default"])("Weekly Newsletter", inf.email, "newsletter", payload, req.headers.host, function (err, info) {
                              console.log(info.response);
                            });
                          })["catch"](function (e) {
                            return console.log(e);
                          });

                        case 2:
                        case "end":
                          return _context4.stop();
                      }
                    }
                  }, _callee4);
                }));

                return function (_x10) {
                  return _ref4.apply(this, arguments);
                };
              }());
            })["catch"](function (e) {
              return console.log(e);
            });

          case 3:
            _context5.next = 8;
            break;

          case 5:
            _context5.prev = 5;
            _context5.t0 = _context5["catch"](0);
            console.log(_context5.t0);

          case 8:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[0, 5]]);
  }));
  return _sendWeeklyEmails.apply(this, arguments);
}

_nodeCron["default"].schedule("0 7 * * Saturday", function () {
  sendWeeklyEmails();
}); // function to send daily digest to daily newsletter subscribers


function sendDailyEmails() {
  return _sendDailyEmails.apply(this, arguments);
}

function _sendDailyEmails() {
  _sendDailyEmails = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6() {
    var end_of_day, convert_to_string;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            end_of_day = (0, _moment["default"])().endOf("day").toString();

            convert_to_string = function convert_to_string(date) {
              return new Date(date).toLocaleDateString();
            };

          case 2:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));
  return _sendDailyEmails.apply(this, arguments);
}

sendDailyEmails();
module.exports = router;