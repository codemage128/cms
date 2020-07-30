"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _formidable = _interopRequireDefault(require("formidable"));

var _crypto = _interopRequireDefault(require("crypto"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _media = _interopRequireDefault(require("../models/media"));

var _auth = _interopRequireDefault(require("../helpers/auth"));

var _settings = _interopRequireDefault(require("../models/settings"));

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

var router = _express["default"].Router();

var cloudinary = require("cloudinary").v2; // Create a new file


router.post("/media/create", /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var set, localForm, s3, awsForm, cloudForm;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return _settings["default"].findOne();

          case 3:
            set = _context.sent;
            _context.t0 = set.media.provider;
            _context.next = _context.t0 === "local" ? 7 : _context.t0 === "amazons3" ? 11 : _context.t0 === "cloudinary" ? 16 : 21;
            break;

          case 7:
            localForm = new _formidable["default"].IncomingForm();
            localForm.parse(req, function (err, fields, files) {});
            localForm.on("end", function (fields, files) {
              for (var x in this.openedFiles) {
                var name = this.openedFiles[x].name.split(".").shift() + "-" + _crypto["default"].randomBytes(2).toString("hex") + "." + this.openedFiles[x].name.split(".").pop();
                var dest = "".concat(_path["default"].join(__dirname, "..", "public", "media", name));

                var data = _fs["default"].readFileSync(this.openedFiles[x].path);

                _fs["default"].writeFileSync(dest, data);

                _fs["default"].unlinkSync(this.openedFiles[x].path);

                var img = new _media["default"]();
                img.file_size = this.openedFiles[x].size;
                img.file_type = this.openedFiles[x].type;
                img.postedBy = req.user.id;
                img.file_name = "/media/".concat(name);
                img.file_extension = this.openedFiles[x].name.split(".").pop();
                img.save().then(function (done) {
                  return res.status(200).json(done);
                })["catch"](function (e) {
                  return next(e);
                });
              }
            });
            return _context.abrupt("break", 21);

          case 11:
            // AWS configuration
            s3 = new _awsSdk["default"].S3({
              accessKeyId: set.media.config.amazons3.accessKeyId,
              secretAccessKey: set.media.config.amazons3.secretAccessKey,
              bucket: set.media.config.amazons3.bucket
            });
            awsForm = new _formidable["default"].IncomingForm();
            awsForm.parse(req, function (err, fields, files) {});
            awsForm.on("end", function (fields, files) {
              var _this = this;

              var _loop = function _loop(x) {
                var stream = _fs["default"].createReadStream(_this.openedFiles[x].path);

                _fs["default"].unlinkSync(_this.openedFiles[x].path);

                var params = {
                  Bucket: set.media.config.amazons3.bucket,
                  Key: _this.openedFiles[x].name.split(".").shift() + "-" + _crypto["default"].randomBytes(2).toString("hex") + "." + _this.openedFiles[x].name.split(".").pop(),
                  Body: stream,
                  ContentType: _this.openedFiles[x].type,
                  ACL: "public-read",
                  processData: false
                };
                s3.upload(params, function (err, data) {
                  if (err) next(err);else {
                    var img = new _media["default"]();
                    img.file_size = awsForm.openedFiles[x].size;
                    img.file_type = awsForm.openedFiles[x].type;
                    img.postedBy = req.user.id;
                    img.file_name = data.Location;
                    img.file_extension = awsForm.openedFiles[x].name.split(".").pop();
                    img.save().then(function (done) {
                      return res.status(200).json(done);
                    })["catch"](function (e) {
                      return next(e);
                    });
                  }
                });
              };

              for (var x in this.openedFiles) {
                _loop(x);
              }
            });
            return _context.abrupt("break", 21);

          case 16:
            // Cloudinary configuration
            cloudinary.config({
              cloud_name: set.media.config.cloudinary.cloud_name,
              api_key: set.media.config.cloudinary.api_key,
              api_secret: set.media.config.cloudinary.api_secret
            });
            cloudForm = new _formidable["default"].IncomingForm();
            cloudForm.parse(req, function (err, fields, files) {});
            cloudForm.on("end", function (fields, files) {
              var _this2 = this;

              var _loop2 = function _loop2(x) {
                cloudinary.uploader.upload_large(_this2.openedFiles[x].path, {
                  resource_type: "raw"
                }, function (err, result) {
                  _fs["default"].unlinkSync(_this2.openedFiles[x].path);

                  var img = new _media["default"]();
                  img.file_size = _this2.openedFiles[x].size;
                  img.file_type = _this2.openedFiles[x].type;
                  img.postedBy = req.user.id;
                  img.file_name = result.secure_url;
                  img.file_extension = _this2.openedFiles[x].name.split(".").pop();
                  img.save().then(function (done) {
                    return res.status(200).json(done);
                  })["catch"](function (e) {
                    return next(e);
                  });
                });
              };

              for (var x in this.openedFiles) {
                _loop2(x);
              }
            });
            return _context.abrupt("break", 21);

          case 21:
            _context.next = 26;
            break;

          case 23:
            _context.prev = 23;
            _context.t1 = _context["catch"](0);
            next(_context.t1);

          case 26:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 23]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}()); // Delete a media

router.post("/media/delete", _auth["default"], function (req, res, next) {
  try {
    _media["default"].deleteOne({
      _id: req.body.mediaId.trim()
    }).then(function (deleted) {
      req.flash("success_msg", "Media has been deleted successfully");
      return res.redirect("back");
    })["catch"](function (e) {
      return next(e);
    });
  } catch (error) {
    next(error);
  }
});
router.get("/media/getLists", _auth["default"], /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var perPage, page, data, count, re, _data, _count, _re, _data2, _count2, _re2, _data3, _count3, _re3;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            perPage = 35;
            page = req.query.page || 1;

            if (!(req.user.roleId == "admin")) {
              _context2.next = 24;
              break;
            }

            if (!req.query.s) {
              _context2.next = 14;
              break;
            }

            _context2.next = 6;
            return _media["default"].find({
              file_type: {
                $regex: req.query.file_type,
                $options: "$i"
              },
              file_name: {
                $regex: req.query.s,
                $options: "$i"
              }
            }).skip(perPage * page - perPage).limit(perPage).sort({
              createdAt: -1
            });

          case 6:
            data = _context2.sent;
            _context2.next = 9;
            return _media["default"].countDocuments({
              file_type: {
                $regex: req.query.file_type,
                $options: "$i"
              },
              file_name: {
                $regex: req.query.s,
                $options: "$i"
              }
            });

          case 9:
            count = _context2.sent;
            re = {
              current: req.query.page,
              total: count,
              data: data,
              page: Math.ceil(count / perPage)
            };
            res.send(re);
            _context2.next = 22;
            break;

          case 14:
            _context2.next = 16;
            return _media["default"].find({
              file_type: {
                $regex: req.query.file_type,
                $options: "$i"
              }
            }).skip(perPage * page - perPage).limit(perPage).sort({
              createdAt: -1
            });

          case 16:
            _data = _context2.sent;
            _context2.next = 19;
            return _media["default"].countDocuments({
              file_type: {
                $regex: req.query.file_type,
                $options: "$i"
              }
            });

          case 19:
            _count = _context2.sent;
            _re = {
              current: req.query.page,
              total: _count,
              data: _data,
              page: Math.ceil(_count / perPage)
            };
            res.send(_re);

          case 22:
            _context2.next = 43;
            break;

          case 24:
            if (!req.query.s) {
              _context2.next = 35;
              break;
            }

            _context2.next = 27;
            return _media["default"].find({
              postedBy: req.user.id,
              file_type: {
                $regex: req.query.file_type,
                $options: "$i"
              },
              file_name: {
                $regex: req.query.s,
                $options: "$i"
              }
            }).skip(perPage * page - perPage).limit(perPage).sort({
              createdAt: -1
            });

          case 27:
            _data2 = _context2.sent;
            _context2.next = 30;
            return _media["default"].countDocuments({
              postedBy: req.user.id,
              file_type: {
                $regex: req.query.file_type,
                $options: "$i"
              },
              file_name: {
                $regex: req.query.s,
                $options: "$i"
              }
            });

          case 30:
            _count2 = _context2.sent;
            _re2 = {
              current: req.query.page,
              total: _count2,
              data: _data2,
              page: Math.ceil(_count2 / perPage)
            };
            res.send(_re2);
            _context2.next = 43;
            break;

          case 35:
            _context2.next = 37;
            return _media["default"].find({
              postedBy: req.user.id,
              file_type: {
                $regex: req.query.file_type,
                $options: "$i"
              }
            }).skip(perPage * page - perPage).limit(perPage).sort({
              createdAt: -1
            });

          case 37:
            _data3 = _context2.sent;
            _context2.next = 40;
            return _media["default"].countDocuments({
              postedBy: req.user.id,
              file_type: {
                $regex: req.query.file_type,
                $options: "$i"
              }
            });

          case 40:
            _count3 = _context2.sent;
            _re3 = {
              current: req.query.page,
              total: _count3,
              data: _data3,
              page: Math.ceil(_count3 / perPage)
            };
            res.send(_re3);

          case 43:
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
module.exports = router;