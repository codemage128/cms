"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _express = _interopRequireDefault(require("express"));

var _formidable = _interopRequireDefault(require("formidable"));

var _ads = _interopRequireDefault(require("../models/ads"));

var _auth = _interopRequireDefault(require("../helpers/auth"));

var _role = _interopRequireDefault(require("../helpers/role"));

var _crypto = _interopRequireDefault(require("crypto"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var router = _express["default"].Router(); // Create a new advert


router.post('/advert/create', _auth["default"], (0, _role["default"])('admin'), function (req, res, next) {
  try {
    var form = new _formidable["default"].IncomingForm();
    form.parse(req, function (err, fields, files) {
      var fileUpload = files.fileName;
      var uploadedData = fields;
      var name = "".concat(_crypto["default"].randomBytes(20).toString('hex')).concat(Date.now().toString(), ".").concat(fileUpload.name.split('.').pop());
      var dest = "".concat(_path["default"].join(__dirname, '..', 'public', 'media', "".concat(name)));

      var data = _fs["default"].readFileSync(fileUpload.path);

      _fs["default"].writeFileSync(dest, data);

      _fs["default"].unlinkSync(fileUpload.path);

      var ads = new _ads["default"]();
      ads.fileSize = fileUpload.size;
      ads.fileType = fileUpload.type;
      ads.fileName = "/media/".concat(name);
      ads.url = uploadedData.url;
      ads.location = uploadedData.location;
      ads.save().then(function (done) {
        req.flash('success_msg', 'Advert has been Created Successfully');
        return res.redirect('back');
      })["catch"](function (e) {
        return next(e);
      });
    });
  } catch (error) {
    next(error);
  }
}); // Delete an advert

router.post('/advert/delete', _auth["default"], (0, _role["default"])('admin'), function (req, res, next) {
  try {
    _ads["default"].deleteOne({
      _id: req.body.advertId
    }).then(function (deleted) {
      req.flash('success_msg', 'Advert has been Deleted successfully');
      return res.redirect('back');
    })["catch"](function (e) {
      return next(e);
    });
  } catch (error) {
    next(error);
  }
});
module.exports = router;