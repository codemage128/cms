"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _express = _interopRequireDefault(require("express"));

var _auth = _interopRequireDefault(require("../helpers/auth"));

var _announcement = _interopRequireDefault(require("../models/announcement"));

var router = _express["default"].Router(); // Create a new announcement


router.post('/announcement/create', _auth["default"], function (req, res, next) {
  try {
    var payload = {
      title: req.body.title,
      body: req.body.body,
      type: !req.body.type ? 'success' : req.body.type
    };

    _announcement["default"].create(payload).then(function (created) {
      req.flash('success_msg', 'Announcement Has been created');
      return res.redirect('back');
    })["catch"](function (e) {
      return next(e);
    });
  } catch (error) {
    next(error);
  }
}); // Edit Single Announcement

router.post('/announcement/edit', _auth["default"], function (req, res, next) {
  try {
    _announcement["default"].updateOne({
      _id: req.body.announcementId
    }, req.body).then(function (updated) {
      req.flash('success_msg', 'Announcement has been updated successfully');
      return res.redirect('back');
    })["catch"](function (e) {
      return next(e);
    });
  } catch (error) {
    next(error);
  }
}); // delete many announcements

router.post('/announcement/deleteMany', _auth["default"], function (req, res, next) {
  try {
    _announcement["default"].deleteMany({
      _id: req.body.ids
    }).then(function (deleted) {
      if (!req.body.ids) {
        req.flash('success_msg', 'Nothing has been Deleted');
        return res.redirect('back');
      } else {
        req.flash('success_msg', 'Announcements has been Deleted');
        return res.redirect('back');
      }
    })["catch"](function (e) {
      return next(e);
    });
  } catch (error) {
    next(error);
  }
}); // Activate many announcements

router.post('/announcement/activateMany', _auth["default"], function (req, res, next) {
  try {
    _announcement["default"].updateMany({
      _id: req.body.ids
    }, {
      $set: {
        active: true
      }
    }).then(function (updated) {
      if (!req.body.ids) {
        req.flash('success_msg', 'Nothing was updated');
        return res.redirect('back');
      } else {
        req.flash('success_msg', 'Announcements has been Activated successfully');
        return res.redirect('back');
      }
    })["catch"](function (e) {
      return next(e);
    });
  } catch (error) {
    next(error);
  }
}); // Deactivate many announcements

router.post('/announcement/deactivateMany', _auth["default"], function (req, res, next) {
  try {
    _announcement["default"].updateMany({
      _id: req.body.ids
    }, {
      $set: {
        active: false
      }
    }).then(function (updated) {
      if (!req.body.ids) {
        req.flash('success_msg', 'Nothing was Deactivated');
        return res.redirect('back');
      } else {
        req.flash('success_msg', 'Announcement has been Deactivated successfully');
        return res.redirect('back');
      }
    })["catch"](function (e) {
      return next(e);
    });
  } catch (error) {
    next(error);
  }
}); // Activate an announcement

router.post('/announcement/activate', _auth["default"], function (req, res, next) {
  try {
    _announcement["default"].updateOne({
      _id: req.body.announcementId
    }, {
      $set: {
        active: true
      }
    }).then(function (updated) {
      req.flash('success_msg', 'Announcement has been Activated successfully');
      return res.redirect('back');
    })["catch"](function (e) {
      return next(e);
    });
  } catch (error) {
    next(error);
  }
}); // Deactivate an announcement

router.post('/announcement/deactivate', _auth["default"], function (req, res, next) {
  try {
    _announcement["default"].updateOne({
      _id: req.body.announcementId
    }, {
      $set: {
        active: false
      }
    }).then(function (updated) {
      req.flash('success_msg', 'Announcement has been Deactivated successfully');
      return res.redirect('back');
    })["catch"](function (e) {
      return next(e);
    });
  } catch (error) {
    next(error);
  }
}); // Delete an annoucement

router.post('/announcement/delete', _auth["default"], function (req, res, next) {
  try {
    _announcement["default"].deleteOne({
      _id: req.body.announcementId
    }).then(function (deleted) {
      req.flash('success_msg', 'Announcement has been Deleted');
      return res.redirect('back');
    })["catch"](function (e) {
      return next(e);
    });
  } catch (error) {
    next(error);
  }
});
module.exports = router;