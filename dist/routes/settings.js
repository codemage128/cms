"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _settings = _interopRequireDefault(require("../models/settings"));

var _auth = _interopRequireDefault(require("../helpers/auth"));

var _role = _interopRequireDefault(require("../helpers/role"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _formidable = _interopRequireDefault(require("formidable"));

var _crypto = _interopRequireDefault(require("crypto"));

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

var _install = _interopRequireDefault(require("../helpers/install"));

var _users = _interopRequireDefault(require("../models/users"));

var _util = _interopRequireDefault(require("util"));

var _request = _interopRequireDefault(require("request"));

var _in = _interopRequireDefault(require("../models/in"));

var request = _util["default"].promisify(_request["default"]);

var router = _express["default"].Router();

var cloudinary = require("cloudinary").v2; // General Settings Update


router.post("/settings/general/update", _auth["default"], (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var errors, payload, settings, set;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            req.assert("siteName", "Site Name field cannot be blank").notEmpty();
            req.assert("siteDescription", "Site Description field cannot be blank").notEmpty();
            errors = req.validationErrors();

            if (!errors) {
              _context.next = 7;
              break;
            }

            req.flash("success_msg", errors[0].msg);
            return _context.abrupt("return", res.redirect("back"));

          case 7:
            payload = {
              siteName: req.body.siteName.trim(),
              siteDescription: req.body.siteDescription.trim(),
              commentSystem: !req.body.commentSystem ? true : req.body.commentSystem == "enable" ? true : false,
              registrationSystem: !req.body.registrationSystem ? true : req.body.registrationSystem == "enable" ? true : false,
              copyright: req.body.copyright,
              googleAnalyticsCode: req.body.googleAnalyticsCode
            };
            _context.next = 10;
            return _settings["default"].find();

          case 10:
            settings = _context.sent;

            if (!(settings == "")) {
              _context.next = 18;
              break;
            }

            _context.next = 14;
            return _settings["default"].create(payload);

          case 14:
            req.flash("success_msg", "General Info Has been Updated Successfully");
            return _context.abrupt("return", res.redirect("back"));

          case 18:
            _context.next = 20;
            return _settings["default"].find();

          case 20:
            set = _context.sent;
            _context.next = 23;
            return _settings["default"].updateOne({
              _id: set[0]._id
            }, payload);

          case 23:
            req.flash("success_msg", "General Info Has been Updated Successfully");
            return _context.abrupt("return", res.redirect("back"));

          case 25:
            _context.next = 30;
            break;

          case 27:
            _context.prev = 27;
            _context.t0 = _context["catch"](0);
            next(_context.t0);

          case 30:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 27]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}()); // Contact settings update

router.post("/settings/contact/update", _auth["default"], (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var settings, set;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return _settings["default"].find();

          case 3:
            settings = _context2.sent;

            if (!(settings == "")) {
              _context2.next = 11;
              break;
            }

            _context2.next = 7;
            return _settings["default"].create(req.body);

          case 7:
            req.flash("success_msg", "Contact Settings Has been Updated Successfully");
            return _context2.abrupt("return", res.redirect("back"));

          case 11:
            _context2.next = 13;
            return _settings["default"].find();

          case 13:
            set = _context2.sent;
            _context2.next = 16;
            return _settings["default"].updateOne({
              _id: set[0]._id
            }, req.body);

          case 16:
            req.flash("success_msg", "Contact Settings Has been Updated Successfully");
            return _context2.abrupt("return", res.redirect("back"));

          case 18:
            _context2.next = 23;
            break;

          case 20:
            _context2.prev = 20;
            _context2.t0 = _context2["catch"](0);
            next(_context2.t0);

          case 23:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 20]]);
  }));

  return function (_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}()); // Social media settings

router.post("/settings/social/update", _auth["default"], (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var settings, set;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return _settings["default"].find();

          case 3:
            settings = _context3.sent;

            if (!(settings == "")) {
              _context3.next = 11;
              break;
            }

            _context3.next = 7;
            return _settings["default"].create(req.body);

          case 7:
            req.flash("success_msg", "Social Media Settings Has been Updated Successfully");
            return _context3.abrupt("return", res.redirect("back"));

          case 11:
            _context3.next = 13;
            return _settings["default"].find();

          case 13:
            set = _context3.sent;
            _context3.next = 16;
            return _settings["default"].updateOne({
              _id: set[0]._id
            }, req.body);

          case 16:
            req.flash("success_msg", "Social Media Settings Has been Updated Successfully");
            return _context3.abrupt("return", res.redirect("back"));

          case 18:
            _context3.next = 23;
            break;

          case 20:
            _context3.prev = 20;
            _context3.t0 = _context3["catch"](0);
            next(_context3.t0);

          case 23:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 20]]);
  }));

  return function (_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}()); // HTML head code settings

router.post("/settings/html-code/update", _auth["default"], (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    var settings, set;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return _settings["default"].find();

          case 3:
            settings = _context4.sent;

            if (!(settings == "")) {
              _context4.next = 11;
              break;
            }

            _context4.next = 7;
            return _settings["default"].create(req.body);

          case 7:
            req.flash("success_msg", "HTML head code Has been Updated Successfully");
            return _context4.abrupt("return", res.redirect("back"));

          case 11:
            _context4.next = 13;
            return _settings["default"].find();

          case 13:
            set = _context4.sent;
            _context4.next = 16;
            return _settings["default"].updateOne({
              _id: set[0]._id
            }, req.body);

          case 16:
            req.flash("success_msg", "HTML head code Has been Updated Successfully");
            return _context4.abrupt("return", res.redirect("back"));

          case 18:
            _context4.next = 23;
            break;

          case 20:
            _context4.prev = 20;
            _context4.t0 = _context4["catch"](0);
            next(_context4.t0);

          case 23:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 20]]);
  }));

  return function (_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}()); // Facebook Comments code settings

router.post("/settings/facebook-comment/update", _auth["default"], (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    var settings, set;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            _context5.next = 3;
            return _settings["default"].find();

          case 3:
            settings = _context5.sent;

            if (!(settings == "")) {
              _context5.next = 11;
              break;
            }

            _context5.next = 7;
            return _settings["default"].create(req.body);

          case 7:
            req.flash("success_msg", "Facebook Comments code Has been Updated Successfully");
            return _context5.abrupt("return", res.redirect("back"));

          case 11:
            _context5.next = 13;
            return _settings["default"].find();

          case 13:
            set = _context5.sent;
            _context5.next = 16;
            return _settings["default"].updateOne({
              _id: set[0]._id
            }, req.body);

          case 16:
            req.flash("success_msg", "Facebook Comments code Has been Updated Successfully");
            return _context5.abrupt("return", res.redirect("back"));

          case 18:
            _context5.next = 23;
            break;

          case 20:
            _context5.prev = 20;
            _context5.t0 = _context5["catch"](0);
            next(_context5.t0);

          case 23:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[0, 20]]);
  }));

  return function (_x13, _x14, _x15) {
    return _ref5.apply(this, arguments);
  };
}()); // Update gmail settings

router.post("/settings/email/gmail/update", _auth["default"], (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res, next) {
    var settings, set;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            _context6.next = 3;
            return _settings["default"].find();

          case 3:
            settings = _context6.sent;

            if (!(settings == "")) {
              _context6.next = 11;
              break;
            }

            _context6.next = 7;
            return _settings["default"].create(req.body);

          case 7:
            req.flash("success_msg", "Gmail Settings Has been Updated Successfully");
            return _context6.abrupt("return", res.redirect("back"));

          case 11:
            _context6.next = 13;
            return _settings["default"].find();

          case 13:
            set = _context6.sent;
            _context6.next = 16;
            return _settings["default"].updateOne({
              _id: set[0]._id
            }, req.body);

          case 16:
            req.flash("success_msg", "Gmail Settings Has been Updated Successfully");
            return _context6.abrupt("return", res.redirect("back"));

          case 18:
            _context6.next = 23;
            break;

          case 20:
            _context6.prev = 20;
            _context6.t0 = _context6["catch"](0);
            next(_context6.t0);

          case 23:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[0, 20]]);
  }));

  return function (_x16, _x17, _x18) {
    return _ref6.apply(this, arguments);
  };
}()); // Update sendgrid details

router.post("/settings/email/sendgrid/update", _auth["default"], (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res, next) {
    var settings, set;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.prev = 0;
            _context7.next = 3;
            return _settings["default"].find();

          case 3:
            settings = _context7.sent;

            if (!(settings == "")) {
              _context7.next = 11;
              break;
            }

            _context7.next = 7;
            return _settings["default"].create(req.body);

          case 7:
            req.flash("success_msg", "Sendgrid Settings Has been Updated Successfully");
            return _context7.abrupt("return", res.redirect("back"));

          case 11:
            _context7.next = 13;
            return _settings["default"].find();

          case 13:
            set = _context7.sent;
            _context7.next = 16;
            return _settings["default"].updateOne({
              _id: set[0]._id
            }, req.body);

          case 16:
            req.flash("success_msg", "Sendgrid Settings Has been Updated Successfully");
            return _context7.abrupt("return", res.redirect("back"));

          case 18:
            _context7.next = 23;
            break;

          case 20:
            _context7.prev = 20;
            _context7.t0 = _context7["catch"](0);
            next(_context7.t0);

          case 23:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[0, 20]]);
  }));

  return function (_x19, _x20, _x21) {
    return _ref7.apply(this, arguments);
  };
}()); // Update AWS SES details

router.post("/settings/email/aws/update", _auth["default"], (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res, next) {
    var settings, set;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.prev = 0;
            _context8.next = 3;
            return _settings["default"].find();

          case 3:
            settings = _context8.sent;

            if (!(settings == "")) {
              _context8.next = 11;
              break;
            }

            _context8.next = 7;
            return _settings["default"].create(req.body);

          case 7:
            req.flash("success_msg", "AWS SES Settings Has been Updated Successfully");
            return _context8.abrupt("return", res.redirect("back"));

          case 11:
            _context8.next = 13;
            return _settings["default"].find();

          case 13:
            set = _context8.sent;
            _context8.next = 16;
            return _settings["default"].updateOne({
              _id: set[0]._id
            }, req.body);

          case 16:
            req.flash("success_msg", "AWS SES Settings Has been Updated Successfully");
            return _context8.abrupt("return", res.redirect("back"));

          case 18:
            _context8.next = 23;
            break;

          case 20:
            _context8.prev = 20;
            _context8.t0 = _context8["catch"](0);
            next(_context8.t0);

          case 23:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[0, 20]]);
  }));

  return function (_x22, _x23, _x24) {
    return _ref8.apply(this, arguments);
  };
}()); // Update SMTP details

router.post("/settings/email/smtp/update", _auth["default"], (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(req, res, next) {
    var settings, set;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.prev = 0;
            _context9.next = 3;
            return _settings["default"].find();

          case 3:
            settings = _context9.sent;

            if (!(settings == "")) {
              _context9.next = 11;
              break;
            }

            _context9.next = 7;
            return _settings["default"].create(req.body);

          case 7:
            req.flash("success_msg", "SMTP Settings Has been Updated Successfully");
            return _context9.abrupt("return", res.redirect("back"));

          case 11:
            _context9.next = 13;
            return _settings["default"].find();

          case 13:
            set = _context9.sent;
            _context9.next = 16;
            return _settings["default"].updateOne({
              _id: set[0]._id
            }, req.body);

          case 16:
            req.flash("success_msg", "SMTP Settings Has been Updated Successfully");
            return _context9.abrupt("return", res.redirect("back"));

          case 18:
            _context9.next = 23;
            break;

          case 20:
            _context9.prev = 20;
            _context9.t0 = _context9["catch"](0);
            next(_context9.t0);

          case 23:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, null, [[0, 20]]);
  }));

  return function (_x25, _x26, _x27) {
    return _ref9.apply(this, arguments);
  };
}()); // Update email verification status

router.post("/settings/email-verification/update", _auth["default"], (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(req, res, next) {
    var settings, payload, set;
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.prev = 0;
            _context10.next = 3;
            return _settings["default"].find();

          case 3:
            settings = _context10.sent;
            payload = {
              emailVerification: !req.body.emailVerification ? req.body.emailVerification == false : req.body.emailVerification == "enable" ? true : false
            };

            if (!(settings == "")) {
              _context10.next = 17;
              break;
            }

            _context10.next = 8;
            return _settings["default"].create(payload);

          case 8:
            if (!(req.body.emailVerification == "enable")) {
              _context10.next = 13;
              break;
            }

            req.flash("success_msg", "Email verification has been enabled");
            return _context10.abrupt("return", res.redirect("back"));

          case 13:
            req.flash("success_msg", "Email verification has been disabled");
            return _context10.abrupt("return", res.redirect("back"));

          case 15:
            _context10.next = 29;
            break;

          case 17:
            _context10.next = 19;
            return _settings["default"].find();

          case 19:
            set = _context10.sent;
            _context10.next = 22;
            return _settings["default"].updateOne({
              _id: set[0]._id
            }, payload);

          case 22:
            if (!(req.body.emailVerification == "enable")) {
              _context10.next = 27;
              break;
            }

            req.flash("success_msg", "Email verification has been enabled");
            return _context10.abrupt("return", res.redirect("back"));

          case 27:
            req.flash("success_msg", "Email verification has been disabled");
            return _context10.abrupt("return", res.redirect("back"));

          case 29:
            _context10.next = 34;
            break;

          case 31:
            _context10.prev = 31;
            _context10.t0 = _context10["catch"](0);
            next(_context10.t0);

          case 34:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, null, [[0, 31]]);
  }));

  return function (_x28, _x29, _x30) {
    return _ref10.apply(this, arguments);
  };
}()); // Update Weekly Nnewsletter Status

router.post("/settings/weekly-newsletter/update", _auth["default"], (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(req, res, next) {
    var settings, payload, set;
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.prev = 0;
            _context11.next = 3;
            return _settings["default"].find();

          case 3:
            settings = _context11.sent;
            payload = {
              sendWeeklyNewsletter: !req.body.sendWeeklyNewsletter ? req.body.sendWeeklyNewsletter == true : req.body.sendWeeklyNewsletter == "enable" ? true : false
            };

            if (!(settings == "")) {
              _context11.next = 17;
              break;
            }

            _context11.next = 8;
            return _settings["default"].create(payload);

          case 8:
            if (!(req.body.sendWeeklyNewsletter == "enable")) {
              _context11.next = 13;
              break;
            }

            req.flash("success_msg", "Weekly Newsletter has been enabled");
            return _context11.abrupt("return", res.redirect("back"));

          case 13:
            req.flash("success_msg", "Weekly Newsletter has been disabled");
            return _context11.abrupt("return", res.redirect("back"));

          case 15:
            _context11.next = 29;
            break;

          case 17:
            _context11.next = 19;
            return _settings["default"].find();

          case 19:
            set = _context11.sent;
            _context11.next = 22;
            return _settings["default"].updateOne({
              _id: set[0]._id
            }, payload);

          case 22:
            if (!(req.body.sendWeeklyNewsletter == "enable")) {
              _context11.next = 27;
              break;
            }

            req.flash("success_msg", "Weekly Newsletter has been enabled");
            return _context11.abrupt("return", res.redirect("back"));

          case 27:
            req.flash("success_msg", "Weekly Newsletter has been disabled");
            return _context11.abrupt("return", res.redirect("back"));

          case 29:
            _context11.next = 34;
            break;

          case 31:
            _context11.prev = 31;
            _context11.t0 = _context11["catch"](0);
            next(_context11.t0);

          case 34:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, null, [[0, 31]]);
  }));

  return function (_x31, _x32, _x33) {
    return _ref11.apply(this, arguments);
  };
}()); // Update send contact to email status

router.post("/settings/contact-to-email/update", _auth["default"], (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(req, res, next) {
    var settings, payload, set;
    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            _context12.prev = 0;
            _context12.next = 3;
            return _settings["default"].find();

          case 3:
            settings = _context12.sent;
            payload = {
              sendContactToEmail: !req.body.sendContactToEmail ? req.body.sendContactToEmail == false : req.body.sendContactToEmail == "enable" ? true : false,
              emailForContact: req.body.emailForContact
            };

            if (!(settings == "")) {
              _context12.next = 17;
              break;
            }

            _context12.next = 8;
            return _settings["default"].create(payload);

          case 8:
            if (!(req.body.sendContactToEmail == "enable")) {
              _context12.next = 13;
              break;
            }

            req.flash("success_msg", "Contact Message will now be sent to your specified email address.");
            return _context12.abrupt("return", res.redirect("back"));

          case 13:
            req.flash("success_msg", "Contact Message will not be sent to your email address.");
            return _context12.abrupt("return", res.redirect("back"));

          case 15:
            _context12.next = 29;
            break;

          case 17:
            _context12.next = 19;
            return _settings["default"].find();

          case 19:
            set = _context12.sent;
            _context12.next = 22;
            return _settings["default"].updateOne({
              _id: set[0]._id
            }, payload);

          case 22:
            if (!(req.body.sendContactToEmail == "enable")) {
              _context12.next = 27;
              break;
            }

            req.flash("success_msg", "Contact Message will now be sent to your specified email address.");
            return _context12.abrupt("return", res.redirect("back"));

          case 27:
            req.flash("success_msg", "Contact Message will not be sent to your email address.");
            return _context12.abrupt("return", res.redirect("back"));

          case 29:
            _context12.next = 34;
            break;

          case 31:
            _context12.prev = 31;
            _context12.t0 = _context12["catch"](0);
            next(_context12.t0);

          case 34:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12, null, [[0, 31]]);
  }));

  return function (_x34, _x35, _x36) {
    return _ref12.apply(this, arguments);
  };
}()); // Update SMTP library

router.post("/settings/email-lib/update", _auth["default"], (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref13 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(req, res, next) {
    var settings, set;
    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            _context13.prev = 0;
            _context13.next = 3;
            return _settings["default"].find();

          case 3:
            settings = _context13.sent;

            if (!(settings == "")) {
              _context13.next = 11;
              break;
            }

            _context13.next = 7;
            return _settings["default"].create(req.body);

          case 7:
            req.flash("success_msg", "Email Library Has been Updated Successfully");
            return _context13.abrupt("return", res.redirect("back"));

          case 11:
            _context13.next = 13;
            return _settings["default"].find();

          case 13:
            set = _context13.sent;
            _context13.next = 16;
            return _settings["default"].updateOne({
              _id: set[0]._id
            }, req.body);

          case 16:
            req.flash("success_msg", "Email Library Has been Updated Successfully");
            return _context13.abrupt("return", res.redirect("back"));

          case 18:
            _context13.next = 23;
            break;

          case 20:
            _context13.prev = 20;
            _context13.t0 = _context13["catch"](0);
            next(_context13.t0);

          case 23:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13, null, [[0, 20]]);
  }));

  return function (_x37, _x38, _x39) {
    return _ref13.apply(this, arguments);
  };
}()); // Update media AWS settings

router.post("/settings/media/aws/update", _auth["default"], (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref14 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14(req, res, next) {
    var settings, set;
    return _regenerator["default"].wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            _context14.prev = 0;
            _context14.next = 3;
            return _settings["default"].find();

          case 3:
            settings = _context14.sent;

            if (!(settings == "")) {
              _context14.next = 11;
              break;
            }

            _context14.next = 7;
            return _settings["default"].create(req.body);

          case 7:
            req.flash("success_msg", "Amazon s3 info Has been Updated Successfully");
            return _context14.abrupt("return", res.redirect("back"));

          case 11:
            _context14.next = 13;
            return _settings["default"].find();

          case 13:
            set = _context14.sent;
            _context14.next = 16;
            return _settings["default"].updateOne({
              _id: set[0]._id
            }, req.body);

          case 16:
            req.flash("success_msg", "Amazon s3 info Has been Updated Successfully");
            return _context14.abrupt("return", res.redirect("back"));

          case 18:
            _context14.next = 23;
            break;

          case 20:
            _context14.prev = 20;
            _context14.t0 = _context14["catch"](0);
            next(_context14.t0);

          case 23:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14, null, [[0, 20]]);
  }));

  return function (_x40, _x41, _x42) {
    return _ref14.apply(this, arguments);
  };
}()); // Update media cloudinary settings

router.post("/settings/media/cloudinary/update", _auth["default"], (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref15 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15(req, res, next) {
    var settings, set;
    return _regenerator["default"].wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            _context15.prev = 0;
            _context15.next = 3;
            return _settings["default"].find();

          case 3:
            settings = _context15.sent;

            if (!(settings == "")) {
              _context15.next = 11;
              break;
            }

            _context15.next = 7;
            return _settings["default"].create(req.body);

          case 7:
            req.flash("success_msg", "Cloudinary info Has been Updated Successfully");
            return _context15.abrupt("return", res.redirect("back"));

          case 11:
            _context15.next = 13;
            return _settings["default"].find();

          case 13:
            set = _context15.sent;
            _context15.next = 16;
            return _settings["default"].updateOne({
              _id: set[0]._id
            }, req.body);

          case 16:
            req.flash("success_msg", "Cloudinary info Has been Updated Successfully");
            return _context15.abrupt("return", res.redirect("back"));

          case 18:
            _context15.next = 23;
            break;

          case 20:
            _context15.prev = 20;
            _context15.t0 = _context15["catch"](0);
            next(_context15.t0);

          case 23:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15, null, [[0, 20]]);
  }));

  return function (_x43, _x44, _x45) {
    return _ref15.apply(this, arguments);
  };
}()); // Update back up storage

router.post("/settings/media/back-up-storage/update", _auth["default"], (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref16 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee16(req, res, next) {
    var settings, set;
    return _regenerator["default"].wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            _context16.prev = 0;
            _context16.next = 3;
            return _settings["default"].find();

          case 3:
            settings = _context16.sent;

            if (!(settings == "")) {
              _context16.next = 11;
              break;
            }

            _context16.next = 7;
            return _settings["default"].create(req.body);

          case 7:
            req.flash("success_msg", "Media Storage has been updated Successfully");
            return _context16.abrupt("return", res.redirect("back"));

          case 11:
            _context16.next = 13;
            return _settings["default"].find();

          case 13:
            set = _context16.sent;
            _context16.next = 16;
            return _settings["default"].updateOne({
              _id: set[0]._id
            }, req.body);

          case 16:
            req.flash("success_msg", "Media Storage has been updated Successfully");
            return _context16.abrupt("return", res.redirect("back"));

          case 18:
            _context16.next = 23;
            break;

          case 20:
            _context16.prev = 20;
            _context16.t0 = _context16["catch"](0);
            next(_context16.t0);

          case 23:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16, null, [[0, 20]]);
  }));

  return function (_x46, _x47, _x48) {
    return _ref16.apply(this, arguments);
  };
}()); // Update logo

router.post("/settings/logo/update", _auth["default"], (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref17 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee25(req, res, next) {
    var settings, set, localForm, s3, awsForm, cloudForm, _set, _localForm, _s, _awsForm, _cloudForm;

    return _regenerator["default"].wrap(function _callee25$(_context25) {
      while (1) {
        switch (_context25.prev = _context25.next) {
          case 0:
            _context25.prev = 0;
            _context25.next = 3;
            return _settings["default"].find();

          case 3:
            settings = _context25.sent;

            if (!(settings == "")) {
              _context25.next = 27;
              break;
            }

            _context25.next = 7;
            return _settings["default"].findOne();

          case 7:
            set = _context25.sent;
            _context25.t0 = set.media.provider;
            _context25.next = _context25.t0 === "local" ? 11 : _context25.t0 === "amazons3" ? 15 : _context25.t0 === "cloudinary" ? 20 : 25;
            break;

          case 11:
            localForm = new _formidable["default"].IncomingForm();
            localForm.parse(req, /*#__PURE__*/function () {
              var _ref18 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee17(err, fields, files) {
                return _regenerator["default"].wrap(function _callee17$(_context17) {
                  while (1) {
                    switch (_context17.prev = _context17.next) {
                      case 0:
                      case "end":
                        return _context17.stop();
                    }
                  }
                }, _callee17);
              }));

              return function (_x52, _x53, _x54) {
                return _ref18.apply(this, arguments);
              };
            }());
            localForm.on("end", /*#__PURE__*/function () {
              var _ref19 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee18(fields, files) {
                var x, name, dest, data, l;
                return _regenerator["default"].wrap(function _callee18$(_context18) {
                  while (1) {
                    switch (_context18.prev = _context18.next) {
                      case 0:
                        _context18.t0 = _regenerator["default"].keys(this.openedFiles);

                      case 1:
                        if ((_context18.t1 = _context18.t0()).done) {
                          _context18.next = 15;
                          break;
                        }

                        x = _context18.t1.value;
                        name = this.openedFiles[x].name.split(".").shift() + "-" + _crypto["default"].randomBytes(2).toString("hex") + "." + this.openedFiles[x].name.split(".").pop();
                        dest = "".concat(_path["default"].join(__dirname, "..", "public", "media", name));
                        data = _fs["default"].readFileSync(this.openedFiles[x].path);

                        _fs["default"].writeFileSync(dest, data);

                        _fs["default"].unlinkSync(this.openedFiles[x].path);

                        l = "/media/".concat(name);
                        _context18.next = 11;
                        return _settings["default"].create({
                          siteLogo: l
                        });

                      case 11:
                        req.flash("success_msg", "Logo Has Been Updated successfully");
                        return _context18.abrupt("return", res.redirect("back"));

                      case 15:
                      case "end":
                        return _context18.stop();
                    }
                  }
                }, _callee18, this);
              }));

              return function (_x55, _x56) {
                return _ref19.apply(this, arguments);
              };
            }());
            return _context25.abrupt("break", 25);

          case 15:
            // AWS configuration
            s3 = new _awsSdk["default"].S3({
              accessKeyId: set.media.config.amazons3.accessKeyId,
              secretAccessKey: set.media.config.amazons3.secretAccessKey,
              bucket: set.media.config.amazons3.bucket
            });
            awsForm = new _formidable["default"].IncomingForm();
            awsForm.parse(req, function (err, fields, files) {});
            awsForm.on("end", function (fields, files) {
              for (var x in this.openedFiles) {
                var stream = _fs["default"].createReadStream(this.openedFiles[x].path);

                _fs["default"].unlinkSync(this.openedFiles[x].path);

                var params = {
                  Bucket: set.media.config.amazons3.bucket,
                  Key: this.openedFiles[x].name.split(".").shift() + "-" + _crypto["default"].randomBytes(2).toString("hex") + "." + this.openedFiles[x].name.split(".").pop(),
                  Body: stream,
                  ContentType: this.openedFiles[x].type,
                  ACL: "public-read",
                  processData: false
                };
                s3.upload(params, /*#__PURE__*/function () {
                  var _ref20 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee19(err, data) {
                    return _regenerator["default"].wrap(function _callee19$(_context19) {
                      while (1) {
                        switch (_context19.prev = _context19.next) {
                          case 0:
                            if (!err) {
                              _context19.next = 4;
                              break;
                            }

                            next(err);
                            _context19.next = 8;
                            break;

                          case 4:
                            _context19.next = 6;
                            return _settings["default"].create({
                              siteLogo: data.Location
                            });

                          case 6:
                            req.flash("success_msg", "Logo Has Been Updated successfully");
                            return _context19.abrupt("return", res.redirect("back"));

                          case 8:
                          case "end":
                            return _context19.stop();
                        }
                      }
                    }, _callee19);
                  }));

                  return function (_x57, _x58) {
                    return _ref20.apply(this, arguments);
                  };
                }());
              }
            });
            return _context25.abrupt("break", 25);

          case 20:
            // Cloudinary configuration
            cloudinary.config({
              cloud_name: set.media.config.cloudinary.cloud_name,
              api_key: set.media.config.cloudinary.api_key,
              api_secret: set.media.config.cloudinary.api_secret
            });
            cloudForm = new _formidable["default"].IncomingForm();
            cloudForm.parse(req, function (err, fields, files) {});
            cloudForm.on("end", /*#__PURE__*/function () {
              var _ref21 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee21(fields, files) {
                var _this = this;

                var _loop, x;

                return _regenerator["default"].wrap(function _callee21$(_context21) {
                  while (1) {
                    switch (_context21.prev = _context21.next) {
                      case 0:
                        _loop = function _loop(x) {
                          cloudinary.uploader.upload(_this.openedFiles[x].path, /*#__PURE__*/function () {
                            var _ref22 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee20(err, result) {
                              return _regenerator["default"].wrap(function _callee20$(_context20) {
                                while (1) {
                                  switch (_context20.prev = _context20.next) {
                                    case 0:
                                      _fs["default"].unlinkSync(_this.openedFiles[x].path);

                                      _context20.next = 3;
                                      return _settings["default"].create({
                                        siteLogo: result.secure_url
                                      });

                                    case 3:
                                      req.flash("success_msg", "Logo Has Been Updated successfully");
                                      return _context20.abrupt("return", res.redirect("back"));

                                    case 5:
                                    case "end":
                                      return _context20.stop();
                                  }
                                }
                              }, _callee20);
                            }));

                            return function (_x61, _x62) {
                              return _ref22.apply(this, arguments);
                            };
                          }());
                        };

                        for (x in this.openedFiles) {
                          _loop(x);
                        }

                      case 2:
                      case "end":
                        return _context21.stop();
                    }
                  }
                }, _callee21, this);
              }));

              return function (_x59, _x60) {
                return _ref21.apply(this, arguments);
              };
            }());
            return _context25.abrupt("break", 25);

          case 25:
            _context25.next = 47;
            break;

          case 27:
            _context25.next = 29;
            return _settings["default"].find();

          case 29:
            _set = _context25.sent;
            _context25.t1 = _set[0].media.provider;
            _context25.next = _context25.t1 === "local" ? 33 : _context25.t1 === "amazons3" ? 37 : _context25.t1 === "cloudinary" ? 42 : 47;
            break;

          case 33:
            _localForm = new _formidable["default"].IncomingForm();

            _localForm.parse(req, function (err, fields, files) {});

            _localForm.on("end", /*#__PURE__*/function () {
              var _ref23 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee22(fields, files) {
                var x, name, dest, data, logo;
                return _regenerator["default"].wrap(function _callee22$(_context22) {
                  while (1) {
                    switch (_context22.prev = _context22.next) {
                      case 0:
                        _context22.t0 = _regenerator["default"].keys(this.openedFiles);

                      case 1:
                        if ((_context22.t1 = _context22.t0()).done) {
                          _context22.next = 15;
                          break;
                        }

                        x = _context22.t1.value;
                        name = this.openedFiles[x].name.split(".").shift() + "-" + _crypto["default"].randomBytes(2).toString("hex") + "." + this.openedFiles[x].name.split(".").pop();
                        dest = "".concat(_path["default"].join(__dirname, "..", "public", "media", name));
                        data = _fs["default"].readFileSync(this.openedFiles[x].path);

                        _fs["default"].writeFileSync(dest, data);

                        _fs["default"].unlinkSync(this.openedFiles[x].path);

                        logo = "/media/".concat(name);
                        _context22.next = 11;
                        return _settings["default"].updateOne({
                          _id: _set[0]._id
                        }, {
                          siteLogo: logo
                        });

                      case 11:
                        req.flash("success_msg", "Logo Has Been Updated successfully");
                        return _context22.abrupt("return", res.redirect("back"));

                      case 15:
                      case "end":
                        return _context22.stop();
                    }
                  }
                }, _callee22, this);
              }));

              return function (_x63, _x64) {
                return _ref23.apply(this, arguments);
              };
            }());

            return _context25.abrupt("break", 47);

          case 37:
            // AWS configuration
            _s = new _awsSdk["default"].S3({
              accessKeyId: _set[0].media.config.amazons3.accessKeyId,
              secretAccessKey: _set[0].media.config.amazons3.secretAccessKey,
              bucket: _set[0].media.config.amazons3.bucket
            });
            _awsForm = new _formidable["default"].IncomingForm();

            _awsForm.parse(req, function (err, fields, files) {});

            _awsForm.on("end", function (fields, files) {
              for (var x in this.openedFiles) {
                var stream = _fs["default"].createReadStream(this.openedFiles[x].path);

                _fs["default"].unlinkSync(this.openedFiles[x].path);

                var params = {
                  Bucket: _set[0].media.config.amazons3.bucket,
                  Key: this.openedFiles[x].name.split(".").shift() + "-" + _crypto["default"].randomBytes(2).toString("hex") + "." + this.openedFiles[x].name.split(".").pop(),
                  Body: stream,
                  ContentType: this.openedFiles[x].type,
                  ACL: "public-read",
                  processData: false
                };

                _s.upload(params, /*#__PURE__*/function () {
                  var _ref24 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee23(err, data) {
                    return _regenerator["default"].wrap(function _callee23$(_context23) {
                      while (1) {
                        switch (_context23.prev = _context23.next) {
                          case 0:
                            if (!err) {
                              _context23.next = 4;
                              break;
                            }

                            next(err);
                            _context23.next = 8;
                            break;

                          case 4:
                            _context23.next = 6;
                            return _settings["default"].updateOne({
                              _id: _set[0]._id
                            }, {
                              siteLogo: data.Location
                            });

                          case 6:
                            req.flash("success_msg", "Logo Has Been Updated successfully");
                            return _context23.abrupt("return", res.redirect("back"));

                          case 8:
                          case "end":
                            return _context23.stop();
                        }
                      }
                    }, _callee23);
                  }));

                  return function (_x65, _x66) {
                    return _ref24.apply(this, arguments);
                  };
                }());
              }
            });

            return _context25.abrupt("break", 47);

          case 42:
            // Cloudinary configuration
            cloudinary.config({
              cloud_name: _set[0].media.config.cloudinary.cloud_name,
              api_key: _set[0].media.config.cloudinary.api_key,
              api_secret: _set[0].media.config.cloudinary.api_secret
            });
            _cloudForm = new _formidable["default"].IncomingForm();

            _cloudForm.parse(req, function (err, fields, files) {});

            _cloudForm.on("end", function (fields, files) {
              var _this2 = this;

              var _loop2 = function _loop2(x) {
                cloudinary.uploader.upload(_this2.openedFiles[x].path, /*#__PURE__*/function () {
                  var _ref25 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee24(err, result) {
                    return _regenerator["default"].wrap(function _callee24$(_context24) {
                      while (1) {
                        switch (_context24.prev = _context24.next) {
                          case 0:
                            _fs["default"].unlinkSync(_this2.openedFiles[x].path);

                            _context24.next = 3;
                            return _settings["default"].updateOne({
                              _id: _set[0]._id
                            }, {
                              siteLogo: result.secure_url
                            });

                          case 3:
                            req.flash("success_msg", "Logo Has Been Updated successfully");
                            return _context24.abrupt("return", res.redirect("back"));

                          case 5:
                          case "end":
                            return _context24.stop();
                        }
                      }
                    }, _callee24);
                  }));

                  return function (_x67, _x68) {
                    return _ref25.apply(this, arguments);
                  };
                }());
              };

              for (var x in this.openedFiles) {
                _loop2(x);
              }
            });

            return _context25.abrupt("break", 47);

          case 47:
            _context25.next = 52;
            break;

          case 49:
            _context25.prev = 49;
            _context25.t2 = _context25["catch"](0);
            next(_context25.t2);

          case 52:
          case "end":
            return _context25.stop();
        }
      }
    }, _callee25, null, [[0, 49]]);
  }));

  return function (_x49, _x50, _x51) {
    return _ref17.apply(this, arguments);
  };
}()); // update site favicon

router.post("/settings/favicon/update", _auth["default"], (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref26 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee34(req, res, next) {
    var settings, set, localForm, s3, awsForm, cloudForm, _set2, _localForm2, _s2, _awsForm2, _cloudForm2;

    return _regenerator["default"].wrap(function _callee34$(_context34) {
      while (1) {
        switch (_context34.prev = _context34.next) {
          case 0:
            _context34.prev = 0;
            _context34.next = 3;
            return _settings["default"].find();

          case 3:
            settings = _context34.sent;

            if (!(settings == "")) {
              _context34.next = 27;
              break;
            }

            _context34.next = 7;
            return _settings["default"].findOne();

          case 7:
            set = _context34.sent;
            _context34.t0 = set.media.provider;
            _context34.next = _context34.t0 === "local" ? 11 : _context34.t0 === "amazons3" ? 15 : _context34.t0 === "cloudinary" ? 20 : 25;
            break;

          case 11:
            localForm = new _formidable["default"].IncomingForm();
            localForm.parse(req, /*#__PURE__*/function () {
              var _ref27 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee26(err, fields, files) {
                return _regenerator["default"].wrap(function _callee26$(_context26) {
                  while (1) {
                    switch (_context26.prev = _context26.next) {
                      case 0:
                      case "end":
                        return _context26.stop();
                    }
                  }
                }, _callee26);
              }));

              return function (_x72, _x73, _x74) {
                return _ref27.apply(this, arguments);
              };
            }());
            localForm.on("end", /*#__PURE__*/function () {
              var _ref28 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee27(fields, files) {
                var x, name, dest, data, l;
                return _regenerator["default"].wrap(function _callee27$(_context27) {
                  while (1) {
                    switch (_context27.prev = _context27.next) {
                      case 0:
                        _context27.t0 = _regenerator["default"].keys(this.openedFiles);

                      case 1:
                        if ((_context27.t1 = _context27.t0()).done) {
                          _context27.next = 15;
                          break;
                        }

                        x = _context27.t1.value;
                        name = this.openedFiles[x].name.split(".").shift() + "-" + _crypto["default"].randomBytes(2).toString("hex") + "." + this.openedFiles[x].name.split(".").pop();
                        dest = "".concat(_path["default"].join(__dirname, "..", "public", "media", name));
                        data = _fs["default"].readFileSync(this.openedFiles[x].path);

                        _fs["default"].writeFileSync(dest, data);

                        _fs["default"].unlinkSync(this.openedFiles[x].path);

                        l = "/media/".concat(name);
                        _context27.next = 11;
                        return _settings["default"].create({
                          favicon: l
                        });

                      case 11:
                        req.flash("success_msg", "favicon Has Been Updated successfully");
                        return _context27.abrupt("return", res.redirect("back"));

                      case 15:
                      case "end":
                        return _context27.stop();
                    }
                  }
                }, _callee27, this);
              }));

              return function (_x75, _x76) {
                return _ref28.apply(this, arguments);
              };
            }());
            return _context34.abrupt("break", 25);

          case 15:
            // AWS configuration
            s3 = new _awsSdk["default"].S3({
              accessKeyId: set.media.config.amazons3.accessKeyId,
              secretAccessKey: set.media.config.amazons3.secretAccessKey,
              bucket: set.media.config.amazons3.bucket
            });
            awsForm = new _formidable["default"].IncomingForm();
            awsForm.parse(req, function (err, fields, files) {});
            awsForm.on("end", function (fields, files) {
              for (var x in this.openedFiles) {
                var stream = _fs["default"].createReadStream(this.openedFiles[x].path);

                _fs["default"].unlinkSync(this.openedFiles[x].path);

                var params = {
                  Bucket: set.media.config.amazons3.bucket,
                  Key: this.openedFiles[x].name.split(".").shift() + "-" + _crypto["default"].randomBytes(2).toString("hex") + "." + this.openedFiles[x].name.split(".").pop(),
                  Body: stream,
                  ContentType: this.openedFiles[x].type,
                  ACL: "public-read",
                  processData: false
                };
                s3.upload(params, /*#__PURE__*/function () {
                  var _ref29 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee28(err, data) {
                    return _regenerator["default"].wrap(function _callee28$(_context28) {
                      while (1) {
                        switch (_context28.prev = _context28.next) {
                          case 0:
                            if (!err) {
                              _context28.next = 4;
                              break;
                            }

                            next(err);
                            _context28.next = 8;
                            break;

                          case 4:
                            _context28.next = 6;
                            return _settings["default"].create({
                              favicon: data.Location
                            });

                          case 6:
                            req.flash("success_msg", "Favicon Has Been Updated successfully");
                            return _context28.abrupt("return", res.redirect("back"));

                          case 8:
                          case "end":
                            return _context28.stop();
                        }
                      }
                    }, _callee28);
                  }));

                  return function (_x77, _x78) {
                    return _ref29.apply(this, arguments);
                  };
                }());
              }
            });
            return _context34.abrupt("break", 25);

          case 20:
            // Cloudinary configuration
            cloudinary.config({
              cloud_name: set.media.config.cloudinary.cloud_name,
              api_key: set.media.config.cloudinary.api_key,
              api_secret: set.media.config.cloudinary.api_secret
            });
            cloudForm = new _formidable["default"].IncomingForm();
            cloudForm.parse(req, function (err, fields, files) {});
            cloudForm.on("end", /*#__PURE__*/function () {
              var _ref30 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee30(fields, files) {
                var _this3 = this;

                var _loop3, x;

                return _regenerator["default"].wrap(function _callee30$(_context30) {
                  while (1) {
                    switch (_context30.prev = _context30.next) {
                      case 0:
                        _loop3 = function _loop3(x) {
                          cloudinary.uploader.upload(_this3.openedFiles[x].path, /*#__PURE__*/function () {
                            var _ref31 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee29(err, result) {
                              return _regenerator["default"].wrap(function _callee29$(_context29) {
                                while (1) {
                                  switch (_context29.prev = _context29.next) {
                                    case 0:
                                      _fs["default"].unlinkSync(_this3.openedFiles[x].path);

                                      _context29.next = 3;
                                      return _settings["default"].create({
                                        favicon: result.secure_url
                                      });

                                    case 3:
                                      req.flash("success_msg", "Favicon Has Been Updated successfully");
                                      return _context29.abrupt("return", res.redirect("back"));

                                    case 5:
                                    case "end":
                                      return _context29.stop();
                                  }
                                }
                              }, _callee29);
                            }));

                            return function (_x81, _x82) {
                              return _ref31.apply(this, arguments);
                            };
                          }());
                        };

                        for (x in this.openedFiles) {
                          _loop3(x);
                        }

                      case 2:
                      case "end":
                        return _context30.stop();
                    }
                  }
                }, _callee30, this);
              }));

              return function (_x79, _x80) {
                return _ref30.apply(this, arguments);
              };
            }());
            return _context34.abrupt("break", 25);

          case 25:
            _context34.next = 47;
            break;

          case 27:
            _context34.next = 29;
            return _settings["default"].find();

          case 29:
            _set2 = _context34.sent;
            _context34.t1 = _set2[0].media.provider;
            _context34.next = _context34.t1 === "local" ? 33 : _context34.t1 === "amazons3" ? 37 : _context34.t1 === "cloudinary" ? 42 : 47;
            break;

          case 33:
            _localForm2 = new _formidable["default"].IncomingForm();

            _localForm2.parse(req, function (err, fields, files) {});

            _localForm2.on("end", /*#__PURE__*/function () {
              var _ref32 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee31(fields, files) {
                var x, name, dest, data, logo;
                return _regenerator["default"].wrap(function _callee31$(_context31) {
                  while (1) {
                    switch (_context31.prev = _context31.next) {
                      case 0:
                        _context31.t0 = _regenerator["default"].keys(this.openedFiles);

                      case 1:
                        if ((_context31.t1 = _context31.t0()).done) {
                          _context31.next = 15;
                          break;
                        }

                        x = _context31.t1.value;
                        name = this.openedFiles[x].name.split(".").shift() + "-" + _crypto["default"].randomBytes(2).toString("hex") + "." + this.openedFiles[x].name.split(".").pop();
                        dest = "".concat(_path["default"].join(__dirname, "..", "public", "media", name));
                        data = _fs["default"].readFileSync(this.openedFiles[x].path);

                        _fs["default"].writeFileSync(dest, data);

                        _fs["default"].unlinkSync(this.openedFiles[x].path);

                        logo = "/media/".concat(name);
                        _context31.next = 11;
                        return _settings["default"].updateOne({
                          _id: _set2[0]._id
                        }, {
                          favicon: logo
                        });

                      case 11:
                        req.flash("success_msg", "Favicon Has Been Updated successfully");
                        return _context31.abrupt("return", res.redirect("back"));

                      case 15:
                      case "end":
                        return _context31.stop();
                    }
                  }
                }, _callee31, this);
              }));

              return function (_x83, _x84) {
                return _ref32.apply(this, arguments);
              };
            }());

            return _context34.abrupt("break", 47);

          case 37:
            // AWS configuration
            _s2 = new _awsSdk["default"].S3({
              accessKeyId: _set2[0].media.config.amazons3.accessKeyId,
              secretAccessKey: _set2[0].media.config.amazons3.secretAccessKey,
              bucket: _set2[0].media.config.amazons3.bucket
            });
            _awsForm2 = new _formidable["default"].IncomingForm();

            _awsForm2.parse(req, function (err, fields, files) {});

            _awsForm2.on("end", function (fields, files) {
              for (var x in this.openedFiles) {
                var stream = _fs["default"].createReadStream(this.openedFiles[x].path);

                _fs["default"].unlinkSync(this.openedFiles[x].path);

                var params = {
                  Bucket: _set2[0].media.config.amazons3.bucket,
                  Key: this.openedFiles[x].name.split(".").shift() + "-" + _crypto["default"].randomBytes(2).toString("hex") + "." + this.openedFiles[x].name.split(".").pop(),
                  Body: stream,
                  ContentType: this.openedFiles[x].type,
                  ACL: "public-read",
                  processData: false
                };

                _s2.upload(params, /*#__PURE__*/function () {
                  var _ref33 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee32(err, data) {
                    return _regenerator["default"].wrap(function _callee32$(_context32) {
                      while (1) {
                        switch (_context32.prev = _context32.next) {
                          case 0:
                            if (!err) {
                              _context32.next = 4;
                              break;
                            }

                            next(err);
                            _context32.next = 8;
                            break;

                          case 4:
                            _context32.next = 6;
                            return _settings["default"].updateOne({
                              _id: _set2[0]._id
                            }, {
                              favicon: data.Location
                            });

                          case 6:
                            req.flash("success_msg", "Favicon Has Been Updated successfully");
                            return _context32.abrupt("return", res.redirect("back"));

                          case 8:
                          case "end":
                            return _context32.stop();
                        }
                      }
                    }, _callee32);
                  }));

                  return function (_x85, _x86) {
                    return _ref33.apply(this, arguments);
                  };
                }());
              }
            });

            return _context34.abrupt("break", 47);

          case 42:
            // Cloudinary configuration
            cloudinary.config({
              cloud_name: _set2[0].media.config.cloudinary.cloud_name,
              api_key: _set2[0].media.config.cloudinary.api_key,
              api_secret: _set2[0].media.config.cloudinary.api_secret
            });
            _cloudForm2 = new _formidable["default"].IncomingForm();

            _cloudForm2.parse(req, function (err, fields, files) {});

            _cloudForm2.on("end", function (fields, files) {
              var _this4 = this;

              var _loop4 = function _loop4(x) {
                cloudinary.uploader.upload(_this4.openedFiles[x].path, /*#__PURE__*/function () {
                  var _ref34 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee33(err, result) {
                    return _regenerator["default"].wrap(function _callee33$(_context33) {
                      while (1) {
                        switch (_context33.prev = _context33.next) {
                          case 0:
                            _fs["default"].unlinkSync(_this4.openedFiles[x].path);

                            _context33.next = 3;
                            return _settings["default"].updateOne({
                              _id: _set2[0]._id
                            }, {
                              favicon: result.secure_url
                            });

                          case 3:
                            req.flash("success_msg", "Favicon Has Been Updated successfully");
                            return _context33.abrupt("return", res.redirect("back"));

                          case 5:
                          case "end":
                            return _context33.stop();
                        }
                      }
                    }, _callee33);
                  }));

                  return function (_x87, _x88) {
                    return _ref34.apply(this, arguments);
                  };
                }());
              };

              for (var x in this.openedFiles) {
                _loop4(x);
              }
            });

            return _context34.abrupt("break", 47);

          case 47:
            _context34.next = 52;
            break;

          case 49:
            _context34.prev = 49;
            _context34.t2 = _context34["catch"](0);
            next(_context34.t2);

          case 52:
          case "end":
            return _context34.stop();
        }
      }
    }, _callee34, null, [[0, 49]]);
  }));

  return function (_x69, _x70, _x71) {
    return _ref26.apply(this, arguments);
  };
}()); // facebook login update

router.post("/settings/social-login/facebook/update", _auth["default"], (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref35 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee35(req, res, next) {
    var settings, set;
    return _regenerator["default"].wrap(function _callee35$(_context35) {
      while (1) {
        switch (_context35.prev = _context35.next) {
          case 0:
            _context35.prev = 0;
            _context35.next = 3;
            return _settings["default"].find();

          case 3:
            settings = _context35.sent;

            if (!(settings == "")) {
              _context35.next = 11;
              break;
            }

            _context35.next = 7;
            return _settings["default"].create(req.body);

          case 7:
            req.flash("success_msg", "Facebook Login Setting has been updated Successfully");
            return _context35.abrupt("return", res.redirect("back"));

          case 11:
            _context35.next = 13;
            return _settings["default"].find();

          case 13:
            set = _context35.sent;
            _context35.next = 16;
            return _settings["default"].updateOne({
              _id: set[0]._id
            }, req.body);

          case 16:
            req.flash("success_msg", "Facebook Login Setting has been updated Successfully");
            return _context35.abrupt("return", res.redirect("back"));

          case 18:
            _context35.next = 23;
            break;

          case 20:
            _context35.prev = 20;
            _context35.t0 = _context35["catch"](0);
            next(_context35.t0);

          case 23:
          case "end":
            return _context35.stop();
        }
      }
    }, _callee35, null, [[0, 20]]);
  }));

  return function (_x89, _x90, _x91) {
    return _ref35.apply(this, arguments);
  };
}()); // Google login update

router.post("/settings/social-login/google/update", _auth["default"], (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref36 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee36(req, res, next) {
    var settings, set;
    return _regenerator["default"].wrap(function _callee36$(_context36) {
      while (1) {
        switch (_context36.prev = _context36.next) {
          case 0:
            _context36.prev = 0;
            _context36.next = 3;
            return _settings["default"].find();

          case 3:
            settings = _context36.sent;

            if (!(settings == "")) {
              _context36.next = 11;
              break;
            }

            _context36.next = 7;
            return _settings["default"].create(req.body);

          case 7:
            req.flash("success_msg", "Google Login Setting has been updated Successfully");
            return _context36.abrupt("return", res.redirect("back"));

          case 11:
            _context36.next = 13;
            return _settings["default"].find();

          case 13:
            set = _context36.sent;
            _context36.next = 16;
            return _settings["default"].updateOne({
              _id: set[0]._id
            }, req.body);

          case 16:
            req.flash("success_msg", "Google Login Setting has been updated Successfully");
            return _context36.abrupt("return", res.redirect("back"));

          case 18:
            _context36.next = 23;
            break;

          case 20:
            _context36.prev = 20;
            _context36.t0 = _context36["catch"](0);
            next(_context36.t0);

          case 23:
          case "end":
            return _context36.stop();
        }
      }
    }, _callee36, null, [[0, 20]]);
  }));

  return function (_x92, _x93, _x94) {
    return _ref36.apply(this, arguments);
  };
}()); // Twitter login update

router.post("/settings/social-login/twitter/update", _auth["default"], (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref37 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee37(req, res, next) {
    var settings, set;
    return _regenerator["default"].wrap(function _callee37$(_context37) {
      while (1) {
        switch (_context37.prev = _context37.next) {
          case 0:
            _context37.prev = 0;
            _context37.next = 3;
            return _settings["default"].find();

          case 3:
            settings = _context37.sent;

            if (!(settings == "")) {
              _context37.next = 11;
              break;
            }

            _context37.next = 7;
            return _settings["default"].create(req.body);

          case 7:
            req.flash("success_msg", "Twitter Login Setting has been updated Successfully");
            return _context37.abrupt("return", res.redirect("back"));

          case 11:
            _context37.next = 13;
            return _settings["default"].find();

          case 13:
            set = _context37.sent;
            _context37.next = 16;
            return _settings["default"].updateOne({
              _id: set[0]._id
            }, req.body);

          case 16:
            req.flash("success_msg", "Twitter Login Setting has been updated Successfully");
            return _context37.abrupt("return", res.redirect("back"));

          case 18:
            _context37.next = 23;
            break;

          case 20:
            _context37.prev = 20;
            _context37.t0 = _context37["catch"](0);
            next(_context37.t0);

          case 23:
          case "end":
            return _context37.stop();
        }
      }
    }, _callee37, null, [[0, 20]]);
  }));

  return function (_x95, _x96, _x97) {
    return _ref37.apply(this, arguments);
  };
}()); // Vkon login update

router.post("/settings/social-login/vkon/update", _auth["default"], (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref38 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee38(req, res, next) {
    var settings, set;
    return _regenerator["default"].wrap(function _callee38$(_context38) {
      while (1) {
        switch (_context38.prev = _context38.next) {
          case 0:
            _context38.prev = 0;
            _context38.next = 3;
            return _settings["default"].find();

          case 3:
            settings = _context38.sent;

            if (!(settings == "")) {
              _context38.next = 11;
              break;
            }

            _context38.next = 7;
            return _settings["default"].create(req.body);

          case 7:
            req.flash("success_msg", "VKontakte Login Setting has been updated Successfully");
            return _context38.abrupt("return", res.redirect("back"));

          case 11:
            _context38.next = 13;
            return _settings["default"].find();

          case 13:
            set = _context38.sent;
            _context38.next = 16;
            return _settings["default"].updateOne({
              _id: set[0]._id
            }, req.body);

          case 16:
            req.flash("success_msg", "VKontakte Login Setting has been updated Successfully");
            return _context38.abrupt("return", res.redirect("back"));

          case 18:
            _context38.next = 23;
            break;

          case 20:
            _context38.prev = 20;
            _context38.t0 = _context38["catch"](0);
            next(_context38.t0);

          case 23:
          case "end":
            return _context38.stop();
        }
      }
    }, _callee38, null, [[0, 20]]);
  }));

  return function (_x98, _x99, _x100) {
    return _ref38.apply(this, arguments);
  };
}()); // Preferences settings update

router.post("/setting/preferences/update", _auth["default"], (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref39 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee39(req, res, next) {
    var payload, set;
    return _regenerator["default"].wrap(function _callee39$(_context39) {
      while (1) {
        switch (_context39.prev = _context39.next) {
          case 0:
            _context39.prev = 0;
            payload = {
              slider: !req.body.slider ? true : req.body.slider == "enable" ? true : false,
              registrationSystem: !req.body.registrationSystem ? true : req.body.registrationSystem == "enable" ? true : false,
              facebookLogin: !req.body.facebookLogin ? true : req.body.facebookLogin == "enable" ? true : false,
              twitterLogin: !req.body.twitterLogin ? true : req.body.twitterLogin == "enable" ? true : false,
              googleLogin: !req.body.googleLogin ? true : req.body.googleLogin == "enable" ? true : false,
              vkontakteLogin: !req.body.vkontakteLogin ? true : req.body.vkontakteLogin == "enable" ? true : false,
              commentSystem: !req.body.commentSystem ? true : req.body.commentSystem == "enable" ? true : false,
              facebookComment: !req.body.facebookComment ? true : req.body.facebookComment == "enable" ? true : false,
              emojiReaction: !req.body.emojiReaction ? true : req.body.emojiReaction == "enable" ? true : false,
              newsletter: !req.body.newsletter ? true : req.body.newsletter == "enable" ? true : false,
              showPostAuthor: !req.body.showPostAuthor ? true : req.body.showPostAuthor == "enable" ? true : false,
              showPostDate: !req.body.showPostDate ? true : req.body.showPostDate == "enable" ? true : false,
              showPostViewCount: !req.body.showPostViewCount ? true : req.body.showPostViewCount == "enable" ? true : false,
              approveAddedUserPost: !req.body.approveAddedUserPost ? true : req.body.approveAddedUserPost == "enable" ? true : false,
              approveUpdatedUserPost: !req.body.approveUpdatedUserPost ? true : req.body.approveUpdatedUserPost == "enable" ? true : false,
              textAsIcon: !req.body.textAsIcon ? false : req.body.textAsIcon == "enable" ? true : false,
              approveComment: !req.body.approveComment ? true : req.body.approveComment == "enable" ? true : false,
              autoLogin: !req.body.autoLogin ? true : req.body.autoLogin == "enable" ? true : false
            };
            _context39.next = 4;
            return _settings["default"].find();

          case 4:
            set = _context39.sent;
            _context39.next = 7;
            return _settings["default"].updateOne({
              _id: set[0]._id
            }, payload);

          case 7:
            req.flash("success_msg", "Preferences has been updated Successfully");
            return _context39.abrupt("return", res.redirect("back"));

          case 11:
            _context39.prev = 11;
            _context39.t0 = _context39["catch"](0);
            next(_context39.t0);

          case 14:
          case "end":
            return _context39.stop();
        }
      }
    }, _callee39, null, [[0, 11]]);
  }));

  return function (_x101, _x102, _x103) {
    return _ref39.apply(this, arguments);
  };
}());
router.get("/install", _install["default"].redirect, function (req, res, next) {
  res.render("install");
});
router.get("/install/settings", _install["default"].disableInstallPage, function (req, res, next) {
  res.render("install-settings");
});
router.get("/install/admin", _install["default"].redirectToAdmin, function (req, res, next) {
  res.render("install-admin");
});
router.post("/verify/purchase", /*#__PURE__*/function () {
  var _ref40 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee41(req, res, next) {
    var err, option;
    return _regenerator["default"].wrap(function _callee41$(_context41) {
      while (1) {
        switch (_context41.prev = _context41.next) {
          case 0:
            req.assert("code", "pls enter a purchase code").notEmpty();
            err = req.validationErrors();

            if (err) {
              req.flash("success_msg", err[0].msg);
              res.redirect("back");
            }

            option = {
              url: "https://nodepress-server.herokuapp.com",
              method: "POST",
              form: {
                code: req.body.code,
                agent: "".concat(req.protocol, "://").concat(req.headers.host)
              }
            };
            request(option).then( /*#__PURE__*/function () {
              var _ref41 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee40(response) {
                return _regenerator["default"].wrap(function _callee40$(_context40) {
                  while (1) {
                    switch (_context40.prev = _context40.next) {
                      case 0:
                        _context40.t0 = response.statusCode;
                        _context40.next = _context40.t0 === 200 ? 3 : _context40.t0 === 404 ? 7 : 10;
                        break;

                      case 3:
                        _context40.next = 5;
                        return _in["default"].create({
                          yes: true
                        });

                      case 5:
                        res.redirect("/install/settings");
                        return _context40.abrupt("break", 11);

                      case 7:
                        req.flash("success_msg", response.body);
                        res.redirect("back");
                        return _context40.abrupt("break", 11);

                      case 10:
                        return _context40.abrupt("break", 11);

                      case 11:
                      case "end":
                        return _context40.stop();
                    }
                  }
                }, _callee40);
              }));

              return function (_x107) {
                return _ref41.apply(this, arguments);
              };
            }())["catch"](function (e) {
              req.flash("success_msg", "Internal server error, pls try again");
              return res.redirect("back");
            });

          case 5:
          case "end":
            return _context41.stop();
        }
      }
    }, _callee41);
  }));

  return function (_x104, _x105, _x106) {
    return _ref40.apply(this, arguments);
  };
}());
router.post("/install", _install["default"].disableInstallPage, function (req, res, next) {
  var form = new _formidable["default"].IncomingForm();
  form.parse(req, /*#__PURE__*/function () {
    var _ref42 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee42(err, fields, files) {
      var logo, favicon, body, name1, name2, dest1, dest2, data1, data2, payload;
      return _regenerator["default"].wrap(function _callee42$(_context42) {
        while (1) {
          switch (_context42.prev = _context42.next) {
            case 0:
              logo = files.siteLogo;
              favicon = files.favicon;
              body = fields;
              name1 = "".concat(_crypto["default"].randomBytes(20).toString("hex")).concat(Date.now().toString(), ".").concat(logo.name.split(".").pop());
              name2 = "".concat(_crypto["default"].randomBytes(20).toString("hex")).concat(Date.now().toString(), ".").concat(favicon.name.split(".").pop(), "}");
              dest1 = "".concat(_path["default"].join(__dirname, "..", "public", "media", "".concat(name1)));
              dest2 = "".concat(_path["default"].join(__dirname, "..", "public", "media", "".concat(name2)));
              data1 = _fs["default"].readFileSync(logo.path);
              data2 = _fs["default"].readFileSync(favicon.path);

              _fs["default"].writeFileSync(dest1, data1);

              _fs["default"].writeFileSync(dest2, data2);

              _fs["default"].unlinkSync(logo.path);

              _fs["default"].unlinkSync(favicon.path);

              payload = {
                siteLogo: "/media/".concat(name1),
                favicon: "/media/".concat(name2),
                siteUrl: "".concat(req.headers.host),
                siteName: body.siteName,
                siteDescription: body.siteDescription
              };
              _context42.next = 16;
              return _settings["default"].create(payload);

            case 16:
              req.flash("success_msg", "Settings Created successfully, now create the admin account");
              return _context42.abrupt("return", res.redirect("/install/admin"));

            case 18:
            case "end":
              return _context42.stop();
          }
        }
      }, _callee42);
    }));

    return function (_x108, _x109, _x110) {
      return _ref42.apply(this, arguments);
    };
  }());
});
router.post("/install/admin", /*#__PURE__*/function () {
  var _ref43 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee43(req, res, next) {
    var error, user;
    return _regenerator["default"].wrap(function _callee43$(_context43) {
      while (1) {
        switch (_context43.prev = _context43.next) {
          case 0:
            req.assert("email", "Email Field cannot be blank").notEmpty();
            req.assert("password", "Password Field cannot be blank").notEmpty();
            req.assert("username", "username field cannot be blank").notEmpty();
            req.assert("firstName", "First name field cannot be blank").notEmpty();
            req.assert("lastName", "Last Name field cannot be blank").notEmpty();
            error = req.validationErrors();

            if (!error) {
              _context43.next = 9;
              break;
            }

            req.flash("success_msg", error[0].msg);
            return _context43.abrupt("return", res.redirect("back"));

          case 9:
            req.body.active = true;
            req.body.roleId = "admin";
            req.body.about = "No info for now";
            req.body.profilePicture = "https://gravatar.com/avatar/" + _crypto["default"].createHash("md5").update(req.body.email).digest("hex").toString() + "?s=200" + "&d=retro";
            _context43.next = 15;
            return _users["default"].create(req.body);

          case 15:
            user = _context43.sent;
            req.logIn(user, function (err) {
              if (err) next(err);
              res.redirect("/dashboard/index");
            });

          case 17:
          case "end":
            return _context43.stop();
        }
      }
    }, _callee43);
  }));

  return function (_x111, _x112, _x113) {
    return _ref43.apply(this, arguments);
  };
}());
module.exports = router;