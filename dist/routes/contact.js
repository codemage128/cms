"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _contact2 = _interopRequireDefault(require("../models/contact"));

var _auth = _interopRequireDefault(require("../helpers/auth"));

var _settings = _interopRequireDefault(require("../models/settings"));

var _mail2 = _interopRequireDefault(require("../helpers/_mail"));

var _install = _interopRequireDefault(require("../helpers/install"));

var router = _express["default"].Router(); // Get contact page


router.get('/contact', _install["default"].redirectToLogin, function (req, res, next) {
  res.render('contact');
}); // Post contact

router.post('/contact', _install["default"].redirectToLogin, /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var set, payload, contact, _contact;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _settings["default"].find();

          case 2:
            set = _context.sent;
            _context.prev = 3;
            payload = {
              fullname: req.body.fullname,
              email: req.body.email,
              number: req.body.number,
              help: req.body.help,
              message: req.body.message,
              siteLink: res.locals.siteLink,
              logo: res.locals.siteLogo,
              instagram: res.locals.instagram,
              facebook: res.locals.facebook,
              twitter: res.locals.twitter
            };

            if (!(set[0].sendContactToEmail == true)) {
              _context.next = 13;
              break;
            }

            (0, _mail2["default"])('A new contact form message', set[0].emailForContact, 'contact-details', payload, req.headers.host, function (err, info) {
              if (err) throw err;
            });
            contact = new _contact2["default"](req.body);
            _context.next = 10;
            return contact.save();

          case 10:
            res.send('Thanks for contacting us, will get back to you soon.');
            _context.next = 17;
            break;

          case 13:
            _contact = new _contact2["default"](req.body);
            _context.next = 16;
            return _contact.save();

          case 16:
            res.send('Thanks for contacting us, will get back to you soon.');

          case 17:
            _context.next = 22;
            break;

          case 19:
            _context.prev = 19;
            _context.t0 = _context["catch"](3);
            next(_context.t0);

          case 22:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[3, 19]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}()); // Delete a contact

router.post('/contact/delete', _install["default"].redirectToLogin, _auth["default"], function (req, res, next) {
  try {
    _contact2["default"].deleteOne({
      _id: req.body.contactId
    }).then(function (success) {
      req.flash('success_msg', 'Contact has been deleted');
      return res.redirect('back');
    })["catch"](function (e) {
      return next(e);
    });
  } catch (e) {
    next(e);
  }
}); // Delete many contact

router.post('/contact/deleteMany', _install["default"].redirectToLogin, _auth["default"], function (req, res, next) {
  try {
    _contact2["default"].deleteMany({
      _id: req.body.ids
    }).then(function (deleted) {
      if (!req.body.ids) {
        req.flash('success_msg', 'Nothing was Deleted');
        return res.redirect('back');
      } else {
        req.flash('success_msg', 'Contact Deleted Successfully');
        return res.redirect('back');
      }
    })["catch"](function (e) {
      return next(e);
    });
  } catch (error) {
    next(error);
  }
});
module.exports = router;