"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _comment = _interopRequireDefault(require("../models/comment"));

var _auth = _interopRequireDefault(require("../helpers/auth"));

var _crypto = _interopRequireDefault(require("crypto"));

var _settings = _interopRequireDefault(require("../models/settings"));

var router = _express["default"].Router(); // Create a new comment


router.post('/comment', /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var set, payload;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _settings["default"].findOne();

          case 2:
            set = _context.sent;

            try {
              payload = {
                slug: req.body.slug,
                name: req.body.name,
                email: req.body.email,
                website: req.body.website,
                comment: req.body.comment,
                ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null),
                articleId: req.body.articleId,
                profilePicture: 'https://gravatar.com/avatar/' + _crypto["default"].createHash('md5').update(req.body.email).digest('hex').toString() + '?s=200' + '&d=retro',
                active: set.approveComment == true ? true : false
              };

              _comment["default"].create(payload).then(function (done) {
                if (set.approveComment == true) res.send('Comment posted Successfully');else res.send('Comment has been logged for moderation');
              })["catch"](function (e) {
                return next(e);
              });
            } catch (error) {
              next(error);
            }

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
}()); // Update a comment

router.post('/comment/update', function (req, res, next) {
  try {
    _comment["default"].updateOne({
      _id: req.body.commentId
    }, req.body).then(function (activated) {
      req.flash('success_msg', 'Comment has been updated successfully');
      return res.redirect('back');
    })["catch"](function (e) {
      return next(e);
    });
  } catch (error) {
    next(error);
  }
}); // Delete a comment

router.post('/comment/delete', _auth["default"], function (req, res, next) {
  try {
    _comment["default"].deleteOne({
      _id: req.body.commentId
    }).then(function (deleted) {
      req.flash('success_msg', 'Comment has been deleted');
      return res.redirect('back');
    })["catch"](function (e) {
      return next(e);
    });
  } catch (error) {
    next(error);
  }
}); // Delete many comment

router.post('/comment/deleteMany', _auth["default"], function (req, res, next) {
  try {
    _comment["default"].deleteMany({
      _id: req.body.ids
    }).then(function (deleted) {
      if (!req.body.ids) {
        req.flash('success_msg', 'Nothing was Deleted');
        return res.redirect('back');
      } else {
        req.flash('success_msg', 'Comment has been Deleted');
        return res.redirect('back');
      }
    })["catch"](function (e) {
      return next(e);
    });
  } catch (error) {
    next(error);
  }
}); // Activate a commet

router.post('/comment/activate', _auth["default"], function (req, res, next) {
  try {
    _comment["default"].updateOne({
      _id: req.body.commentId
    }, {
      $set: {
        active: true
      }
    }).then(function (activated) {
      req.flash('success_msg', 'Comment has been activated');
      return res.redirect('back');
    })["catch"](function (e) {
      return next(e);
    });
  } catch (error) {
    next(error);
  }
}); // Deactivate a comment

router.post('/comment/deactivate', _auth["default"], function (req, res, next) {
  try {
    _comment["default"].updateOne({
      _id: req.body.commentId
    }, {
      $set: {
        active: false
      }
    }).then(function (activated) {
      req.flash('success_msg', 'Comment has been Deactivated');
      return res.redirect('back');
    })["catch"](function (e) {
      return next(e);
    });
  } catch (error) {
    next(error);
  }
}); // Approve many comments

router.post('/comment/approveMany', _auth["default"], function (req, res, next) {
  try {
    _comment["default"].updateMany({
      _id: req.body.ids
    }, {
      $set: {
        active: true
      }
    }).then(function (activated) {
      if (!req.body.ids) {
        req.flash('success_msg', 'No Comment was Approved');
        return res.redirect('back');
      } else {
        req.flash('success_msg', 'Comments has been Approved');
        return res.redirect('back');
      }
    })["catch"](function (e) {
      return next(e);
    });
  } catch (error) {
    next(error);
  }
}); // Unapprove many comments

router.post('/comment/unapproveMany', _auth["default"], function (req, res, next) {
  try {
    _comment["default"].updateMany({
      _id: req.body.ids
    }, {
      $set: {
        active: false
      }
    }).then(function (activated) {
      if (!req.body.ids) {
        req.flash('success_msg', 'No Changes was Made');
        return res.redirect('back');
      } else {
        req.flash('success_msg', 'Comments has been Unapproved Successfully');
        return res.redirect('back');
      }
    })["catch"](function (e) {
      return next(e);
    });
  } catch (error) {
    next(error);
  }
}); // Reply to a comment

router.post('/reply', function (req, res, next) {
  try {
    var payload = {
      name: req.body.name,
      email: req.body.email,
      reply: req.body.reply,
      profilePicture: 'https://gravatar.com/avatar/' + _crypto["default"].createHash('md5').update(req.body.email).digest('hex').toString() + '?s=200' + '&d=retro'
    };

    _comment["default"].updateOne({
      _id: req.body.commentId
    }, {
      $push: {
        replies: payload
      }
    }).then(function (replied) {
      res.status(200).send('Replied successfully');
    })["catch"](function (e) {
      return next(e);
    });
  } catch (error) {
    next(error);
  }
}); // Update a reply

router.post('/reply/update', function (req, res, next) {
  try {
    _comment["default"].updateOne({
      'replies._id': req.body.replyId
    });
  } catch (error) {
    next(error);
  }
});
module.exports = router;