"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _users = _interopRequireDefault(require("../models/users"));

var _crypto = _interopRequireDefault(require("crypto"));

var _formidable = _interopRequireDefault(require("formidable"));

var _mail2 = _interopRequireDefault(require("../helpers/_mail"));

var _settings = _interopRequireDefault(require("../models/settings"));

var _passport = _interopRequireDefault(require("../helpers/passport"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _auth = _interopRequireDefault(require("../helpers/auth"));

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

var _cloudinary = require("cloudinary");

var _articles = _interopRequireDefault(require("../models/articles"));

var _install = _interopRequireDefault(require("../helpers/install"));

var _role = _interopRequireDefault(require("../helpers/role"));

var _newsletter = _interopRequireDefault(require("../models/newsletter"));

var router = _express["default"].Router();

// Prevent logged in users from viewing the sign up and login page
function checkIfLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return res.redirect("back");else {
    next();
  }
} // Facebook Login auth


router.get("/auth/facebook", _install["default"].redirectToLogin, _passport["default"].authenticate("facebook", {
  scope: ["email"]
}));
router.get("/auth/facebook/callback", _passport["default"].authenticate("facebook", {
  failureRedirect: "/login",
  successRedirect: "/"
})); // Google login auth

router.get("/auth/google", _install["default"].redirectToLogin, _passport["default"].authenticate("google", {
  scope: ["profile", "email"]
}));
router.get("/auth/google/callback", _passport["default"].authenticate("google", {
  failureRedirect: "/login",
  successRedirect: "/"
})); // Twitter login auth

router.get("/auth/twitter", _install["default"].redirectToLogin, _passport["default"].authenticate("twitter"));
router.get("/auth/twitter/callback", _passport["default"].authenticate("twitter", {
  failureRedirect: "/login",
  successRedirect: "/"
})); // Vkontakte login auth

router.get("/auth/vkontakte", _install["default"].redirectToLogin, _passport["default"].authenticate("vkontakte", {
  scope: ["email"]
}));
router.get("/auth/vkontakte/callback", _passport["default"].authenticate("vkontakte", {
  failureRedirect: "/login",
  successRedirect: "/"
})); // Get sign up page

router.get("/sign-up", _install["default"].redirectToLogin, checkIfLoggedIn, function (req, res, next) {
  res.render("sign-up");
}); // Create a new user

router.post("/sign-up", _install["default"].redirectToLogin, checkIfLoggedIn, /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var set, payload, check, user;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return _settings["default"].findOne();

          case 3:
            set = _context.sent;

            if (!(set.registrationSystem == true)) {
              _context.next = 41;
              break;
            }

            payload = {
              email: req.body.email.trim(),
              password: req.body.password.trim(),
              token: _crypto["default"].randomBytes(16).toString("hex"),
              username: req.body.username.trim(),
              profilePicture: "https://gravatar.com/avatar/" + _crypto["default"].createHash("md5").update(req.body.email).digest("hex").toString() + "?s=200" + "&d=retro",
              active: typeof set.emailVerification == "undefined" ? true : set.emailVerification == true ? false : true,
              roleId: "user",
              firstName: "Not Specified",
              lastName: "Not Specified",
              siteLink: res.locals.siteLink,
              logo: res.locals.siteLogo,
              instagram: res.locals.instagram,
              facebook: res.locals.facebook,
              twitter: res.locals.twitter
            };

            if (!(req.body.password !== req.body.cPassword)) {
              _context.next = 11;
              break;
            }

            req.flash("success_msg", "Password Does/'nt match");
            return _context.abrupt("return", res.redirect("back"));

          case 11:
            _context.next = 13;
            return _users["default"].findOne({
              email: req.body.email
            });

          case 13:
            check = _context.sent;

            if (!check) {
              _context.next = 19;
              break;
            }

            req.flash("success_msg", "Email has been used");
            return _context.abrupt("return", res.redirect("back"));

          case 19:
            _context.next = 21;
            return _users["default"].create(payload);

          case 21:
            user = _context.sent;

            if (!(set.emailVerification == true)) {
              _context.next = 27;
              break;
            }

            _context.next = 25;
            return (0, _mail2["default"])("Registration Successfull", req.body.email, "reg-email", payload, req.headers.host, function (err, info) {
              if (err) console.log(err);
            });

          case 25:
            _context.next = 28;
            break;

          case 27:
            null;

          case 28:
            if (!(set.emailVerification == true)) {
              _context.next = 33;
              break;
            }

            req.flash("success_msg", "Registration Successfull, pls check your email for futher instrcutions");
            return _context.abrupt("return", res.redirect("back"));

          case 33:
            if (!(set.autoLogin == true)) {
              _context.next = 37;
              break;
            }

            req.logIn(user, function (err) {
              if (err) return next(err);

              if (user.roleId === "user") {
                return res.redirect("/user/dashboard");
              } else if (user.roleId === "admin") {
                return res.redirect("/dashboard/index");
              }
            });
            _context.next = 39;
            break;

          case 37:
            req.flash("success_msg", "Registration Successfull");
            return _context.abrupt("return", res.redirect("/login"));

          case 39:
            _context.next = 42;
            break;

          case 41:
            res.render("404");

          case 42:
            _context.next = 47;
            break;

          case 44:
            _context.prev = 44;
            _context.t0 = _context["catch"](0);
            next(_context.t0);

          case 47:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 44]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}()); // Create a new user manually

router.post("/user/create", _install["default"].redirectToLogin, /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var check, username, payload;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            req.body.roleId = !req.body.roleId ? "user" : req.body.roleId;
            req.body.email = req.body.email.trim();
            req.body.password = req.body.password.trim();
            req.body.username = req.body.username.trim();
            req.body.active = true;
            req.body.firstName = req.body.firstName == "" ? "Not Specified" : req.body.firstName;
            req.body.lastName = req.body.lastName == "" ? "Not Specified" : req.body.lastName;
            req.body.profilePicture = "https://gravatar.com/avatar/" + _crypto["default"].createHash("md5").update(req.body.email).digest("hex").toString() + "?s=200" + "&d=retro";
            _context2.next = 11;
            return _users["default"].findOne({
              email: req.body.email
            });

          case 11:
            check = _context2.sent;
            _context2.next = 14;
            return _users["default"].findOne({
              username: req.body.username
            });

          case 14:
            username = _context2.sent;

            if (!(check || username)) {
              _context2.next = 20;
              break;
            }

            req.flash("success_msg", "".concat(check ? "Email" : "Username", " has been used"));
            return _context2.abrupt("return", res.redirect("back"));

          case 20:
            req.body.siteLink = res.locals.siteLink;
            req.body.logo = res.locals.siteLogo;
            req.body.instagram = res.locals.instagram;
            req.body.facebook = res.locals.facebook;
            req.body.twitter = res.locals.twitter;
            payload = req.body;
            _context2.next = 28;
            return _users["default"].create(req.body);

          case 28:
            _context2.next = 30;
            return (0, _mail2["default"])("Registration Successfull", req.body.email, "reg-email2", payload, req.headers.host, function (err, info) {
              if (err) console.log(err);
            });

          case 30:
            req.flash("success_msg", "User Created Successfully");
            return _context2.abrupt("return", res.redirect("back"));

          case 32:
            _context2.next = 37;
            break;

          case 34:
            _context2.prev = 34;
            _context2.t0 = _context2["catch"](0);
            next(_context2.t0);

          case 37:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 34]]);
  }));

  return function (_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}()); // Verify a user account route

router.get("/verify-account", _install["default"].redirectToLogin, checkIfLoggedIn, /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var set;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return _settings["default"].findOne();

          case 2:
            set = _context3.sent;

            try {
              if (req.query.token) {
                // check if the token exist
                _users["default"].findOne({
                  token: req.query.token
                }).then(function (user) {
                  if (!user) {
                    req.flash("success_msg", "The token is inavlid, pls check your mail again");
                    return res.redirect("back");
                  } else {
                    user.token = undefined;
                    user.active = true;
                    user.verified = true;
                    user.save().then(function (user) {
                      if (set.autoLogin) {
                        req.logIn(user, function (err, user) {
                          if (err) return next(err);
                          return res.redirect("/user/dashboard");
                        });
                      } else {
                        req.flash("success_msg", "Account Verified Successfully, you can now login.");
                        res.redirect("/login");
                      }
                    })["catch"](function (err) {
                      return next(err);
                    });
                  }
                });
              } else {
                res.render("404");
              }
            } catch (e) {
              next(e);
            }

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
}()); // Get login route

router.get("/login", _install["default"].redirectToLogin, checkIfLoggedIn, function (req, res, next) {
  res.render("login", {
    title: res.locals.siteTitle
  });
});
router.post("/login", _install["default"].redirectToLogin, checkIfLoggedIn, function (req, res, next) {
  _passport["default"].authenticate("local", function (err, user, info) {
    if (err) return next(err);

    if (!user) {
      req.flash("success_msg", "Incorect Email or password");
      return res.redirect("back");
    }

    if (typeof user.active == "boolean" && user.active === false) {
      req.flash("success_msg", "Your account is not active, check your email to activate your account");
      return res.redirect("back");
    }

    if (user.banned === true) {
      req.flash("success_msg", "Your Account has been suspended, You can visit the contact page for help.");
    }

    req.logIn(user, function (err) {
      if (err) return next(err);

      if (user.roleId === "user") {
        return res.redirect("/user/dashboard");
      } else if (user.roleId === "admin") {
        return res.redirect("/dashboard/index");
      }
    });
  })(req, res, next);
}); // Get forgot password page

router.get("/forgot-password", _install["default"].redirectToLogin, checkIfLoggedIn, function (req, res, next) {
  res.render("forgot-pass", {
    title: res.locals.siteTitle
  });
}); // Forgot password route

router.post("/forgot-password", _install["default"].redirectToLogin, function (req, res, next) {
  try {
    var token = _crypto["default"].randomBytes(20).toString("hex"); // Check the database if there's any user with the specified user


    _users["default"].findOne({
      email: req.body.email
    }).then(function (user) {
      if (!user) {
        // user does not exist
        req.flash("success_msg", "Email does not match with any account");
        return res.redirect("back");
      } else {
        user.passwordResetToken = token;
        user.passwordResetExpiryDate = Date.now() + 3600000; // 1 hour

        user.save().then(function (user) {
          var emailVariables = {
            email: user.email,
            token: user.passwordResetToken
          };
          (0, _mail2["default"])("Forgotten Passwird", user.email, "forgot-email", emailVariables, req.headers.host, function (err, info) {
            console.log(info.response);
          });
          req.flash("success_msg", "An email has been sent to your account with further instructions");
          return res.redirect("back");
        })["catch"](function (err) {
          return next(err);
        });
      }
    })["catch"](function (err) {
      return next(err);
    });
  } catch (e) {
    next(e);
  }
}); // Get resest password page

router.get("/reset/:token", _install["default"].redirectToLogin, function (req, res, next) {
  res.render("reset", {
    title: res.locals.siteTitle
  });
}); // Reset password route

router.post("/reset/:token", _install["default"].redirectToLogin, function (req, res, next) {
  try {
    _users["default"].findOne({
      passwordResetToken: req.params.token,
      passwordResetExpiryDate: {
        $gt: Date.now()
      }
    }).then(function (user) {
      if (!user) {
        req.flash("success_msg", "Token is invalid or it might has expired");
        return res.redirect("back");
      } else {
        user.passwordResetToken = undefined;
        user.passwordResetExpiryDate = undefined;
        user.password = req.body.password;
        user.save().then(function (user) {
          req.flash("success_msg", "Your password has been updated successfully, you can now login");
          return res.redirect("/login");
        })["catch"](function (err) {
          return next(err);
        });
      }
    });
  } catch (e) {
    next(e);
  }
}); // Update user info route

router.post("/user/dashboard/update/info", _install["default"].redirectToLogin, _auth["default"], /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    var user, use;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return _users["default"].findById(req.user.id);

          case 3:
            user = _context4.sent;

            if (!(user.email == req.body.email)) {
              _context4.next = 8;
              break;
            }

            _users["default"].updateOne({
              _id: req.user.id
            }, req.body).then(function (user) {
              req.flash("success_msg", "Your profile has been updated successfully");
              return res.redirect("back");
            })["catch"](function (err) {
              return next(err);
            });

            _context4.next = 17;
            break;

          case 8:
            _context4.next = 10;
            return _users["default"].findOne({
              email: req.body.email
            });

          case 10:
            use = _context4.sent;

            if (!use) {
              _context4.next = 16;
              break;
            }

            req.flash("success_msg", "The Email you provided has been used");
            return _context4.abrupt("return", res.redirect("back"));

          case 16:
            _users["default"].updateOne({
              _id: req.user.id
            }, req.body).then(function (user) {
              req.flash("success_msg", "Your profile has been updated successfully");
              return res.redirect("back");
            })["catch"](function (err) {
              return next(err);
            });

          case 17:
            _context4.next = 22;
            break;

          case 19:
            _context4.prev = 19;
            _context4.t0 = _context4["catch"](0);
            next(_context4.t0);

          case 22:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 19]]);
  }));

  return function (_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}()); // Update user profile picture

/**
 * @TODO retructure how name is been saved
 */

router.post("/user/dashboard/update/profile-picture", _install["default"].redirectToLogin, _auth["default"], /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res, next) {
    var set, form, s3, awsForm, cloudForm;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.prev = 0;
            _context8.next = 3;
            return _settings["default"].find();

          case 3:
            set = _context8.sent;
            _context8.t0 = set[0].media.provider;
            _context8.next = _context8.t0 === "local" ? 7 : _context8.t0 === "amazons3" ? 10 : _context8.t0 === "cloudinary" ? 15 : 20;
            break;

          case 7:
            form = new _formidable["default"].IncomingForm();
            form.parse(req, function (err, fields, files) {
              var fileUpload = files.profilePicture;
              var uploadedData = fields;
              var name = "".concat(_crypto["default"].randomBytes(20).toString("hex")).concat(Date.now().toString(), ".").concat(fileUpload.name.split(".").pop());
              var dest = "".concat(_path["default"].join(__dirname, "..", "public", "media", "".concat(name)));

              var data = _fs["default"].readFileSync(fileUpload.path);

              _fs["default"].writeFileSync(dest, data);

              _fs["default"].unlinkSync(fileUpload.path);

              uploadedData.profilePicture = "/media/".concat(name);

              _users["default"].updateOne({
                _id: req.user.id
              }, {
                $set: {
                  profilePicture: uploadedData.profilePicture
                }
              }).then(function (user) {
                req.flash("success_msg", "Profile Picture has been updated successfully");
                return res.redirect("back");
              })["catch"](function (err) {
                return next(err);
              });
            });
            return _context8.abrupt("break", 20);

          case 10:
            // AWS configuration
            s3 = new _awsSdk["default"].S3({
              accessKeyId: set[0].media.config.amazons3.accessKeyId,
              secretAccessKey: set[0].media.config.amazons3.secretAccessKey,
              bucket: set[0].media.config.amazons3.bucket
            });
            awsForm = new _formidable["default"].IncomingForm();
            awsForm.parse(req, function (err, fields, files) {});
            awsForm.on("end", function (fields, files) {
              for (var x in this.openedFiles) {
                var stream = _fs["default"].createReadStream(this.openedFiles[x].path);

                _fs["default"].unlinkSync(this.openedFiles[x].path);

                var params = {
                  Bucket: set[0].media.config.amazons3.bucket,
                  Key: this.openedFiles[x].name.split(".").shift() + "-" + _crypto["default"].randomBytes(2).toString("hex") + "." + this.openedFiles[x].name.split(".").pop(),
                  Body: stream,
                  ContentType: this.openedFiles[x].type,
                  ACL: "public-read",
                  processData: false
                };
                s3.upload(params, /*#__PURE__*/function () {
                  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(err, data) {
                    return _regenerator["default"].wrap(function _callee5$(_context5) {
                      while (1) {
                        switch (_context5.prev = _context5.next) {
                          case 0:
                            if (err) next(err);else {
                              _users["default"].updateOne({
                                _id: req.user.id
                              }, {
                                $set: {
                                  profilePicture: data.Location
                                }
                              }).then(function (user) {
                                req.flash("success_msg", "Profile Picture has been updated successfully");
                                return res.redirect("back");
                              })["catch"](function (err) {
                                return next(err);
                              });
                            }

                          case 1:
                          case "end":
                            return _context5.stop();
                        }
                      }
                    }, _callee5);
                  }));

                  return function (_x16, _x17) {
                    return _ref6.apply(this, arguments);
                  };
                }());
              }
            });
            return _context8.abrupt("break", 20);

          case 15:
            // Cloudinary configuration
            _cloudinary.v2.config({
              cloud_name: set[0].media.config.cloudinary.cloud_name,
              api_key: set[0].media.config.cloudinary.api_key,
              api_secret: set[0].media.config.cloudinary.api_secret
            });

            cloudForm = new _formidable["default"].IncomingForm();
            cloudForm.parse(req, function (err, fields, files) {});
            cloudForm.on("end", /*#__PURE__*/function () {
              var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(fields, files) {
                var _this = this;

                var _loop, x;

                return _regenerator["default"].wrap(function _callee7$(_context7) {
                  while (1) {
                    switch (_context7.prev = _context7.next) {
                      case 0:
                        _loop = function _loop(x) {
                          _cloudinary.v2.uploader.upload(_this.openedFiles[x].path, /*#__PURE__*/function () {
                            var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(err, result) {
                              return _regenerator["default"].wrap(function _callee6$(_context6) {
                                while (1) {
                                  switch (_context6.prev = _context6.next) {
                                    case 0:
                                      _fs["default"].unlinkSync(_this.openedFiles[x].path);

                                      _users["default"].updateOne({
                                        _id: req.user.id
                                      }, {
                                        $set: {
                                          profilePicture: result.secure_url
                                        }
                                      }).then(function (user) {
                                        req.flash("success_msg", "Profile Picture has been updated successfully");
                                        return res.redirect("back");
                                      })["catch"](function (err) {
                                        return next(err);
                                      });

                                    case 2:
                                    case "end":
                                      return _context6.stop();
                                  }
                                }
                              }, _callee6);
                            }));

                            return function (_x20, _x21) {
                              return _ref8.apply(this, arguments);
                            };
                          }());
                        };

                        for (x in this.openedFiles) {
                          _loop(x);
                        }

                      case 2:
                      case "end":
                        return _context7.stop();
                    }
                  }
                }, _callee7, this);
              }));

              return function (_x18, _x19) {
                return _ref7.apply(this, arguments);
              };
            }());
            return _context8.abrupt("break", 20);

          case 20:
            _context8.next = 25;
            break;

          case 22:
            _context8.prev = 22;
            _context8.t1 = _context8["catch"](0);
            next(_context8.t1);

          case 25:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[0, 22]]);
  }));

  return function (_x13, _x14, _x15) {
    return _ref5.apply(this, arguments);
  };
}()); // Update user password

router.post("/user/dashboard/update/password", _install["default"].redirectToLogin, _auth["default"], function (req, res, next) {
  try {
    _users["default"].findOne({
      _id: req.user.id
    }).then(function (user) {
      user.comparePassword(req.body.currentPassword, function (err, isMatch) {
        if (isMatch == true) {
          if (req.body.password.trim().length > 1) {
            user.password = req.body.password;
            user.save().then(function (user) {
              req.flash("success_msg", "Your password has been updated");
              return res.redirect("back");
            })["catch"](function (err) {
              return next(err);
            });
          } else {
            req.flash("success_msg", "password field cannot be empty or too short");
            return res.redirect("back");
          }
        } else {
          req.flash("success_msg", "The current password you provided is incorrect");
          return res.redirect("back");
        }
      });
    })["catch"](function (err) {
      return next(err);
    });
  } catch (e) {
    next(e);
  }
}); // Log out route

router.get("/log-out", function (req, res, next) {
  try {
    if (!req.user) res.redirect("/login");else {
      _users["default"].updateOne({
        _id: req.user.id
      }, {
        lastLoggedIn: Date.now()
      }).then(function (updated) {
        req.logout();
        req.flash("success_msg", "You are now logged out");
        res.redirect("/login");
      });
    }
  } catch (error) {
    next(error);
  }
}); // Delete Many User

router.post("/user/dashboard/deleteMany", _install["default"].redirectToLogin, _auth["default"], /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(req, res, next) {
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.prev = 0;
            _context9.next = 3;
            return _articles["default"].deleteMany({
              postedBy: req.body.ids
            });

          case 3:
            _users["default"].deleteMany({
              _id: req.body.ids
            }).then(function (deleted) {
              if (!req.body.ids) {
                req.flash("success_msg", "No User Was Deleted");
                return res.redirect("back");
              } else {
                req.flash("success_msg", "Users was Deleted Successfully");
                return res.redirect("back");
              }
            })["catch"](function (e) {
              return next(e);
            });

            _context9.next = 9;
            break;

          case 6:
            _context9.prev = 6;
            _context9.t0 = _context9["catch"](0);
            next(_context9.t0);

          case 9:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, null, [[0, 6]]);
  }));

  return function (_x22, _x23, _x24) {
    return _ref9.apply(this, arguments);
  };
}()); // Update another user info

router.post("/user/edit", _auth["default"], /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(req, res, next) {
    var user, use;
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.prev = 0;
            _context10.next = 3;
            return _users["default"].findById(req.body.userId);

          case 3:
            user = _context10.sent;

            if (!(user.email == req.body.email)) {
              _context10.next = 8;
              break;
            }

            _users["default"].updateOne({
              _id: req.body.userId
            }, req.body).then(function (user) {
              req.flash("success_msg", "User's profile has been updated successfully");
              return res.redirect("back");
            })["catch"](function (err) {
              return next(err);
            });

            _context10.next = 17;
            break;

          case 8:
            _context10.next = 10;
            return _users["default"].findOne({
              email: req.body.email
            });

          case 10:
            use = _context10.sent;

            if (!use) {
              _context10.next = 16;
              break;
            }

            req.flash("success_msg", "The Email you provided has been used");
            return _context10.abrupt("return", res.redirect("back"));

          case 16:
            _users["default"].updateOne({
              _id: req.body.userId
            }, req.body).then(function (user) {
              req.flash("success_msg", "User's profile has been updated successfully");
              return res.redirect("back");
            })["catch"](function (err) {
              return next(err);
            });

          case 17:
            _context10.next = 22;
            break;

          case 19:
            _context10.prev = 19;
            _context10.t0 = _context10["catch"](0);
            next(_context10.t0);

          case 22:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, null, [[0, 19]]);
  }));

  return function (_x25, _x26, _x27) {
    return _ref10.apply(this, arguments);
  };
}()); // Update another user password

router.post("/user/password/edit", _auth["default"], function (req, res, next) {
  try {
    if (req.body.password !== req.body.repassword) {
      req.flash("success_msg", "Password doesn't match");
      return res.redirect("back");
    } else {
      _users["default"].findOne({
        _id: req.body.userId
      }).then(function (user) {
        user.password = req.body.password;
        user.save().then(function (saved) {
          req.flash("success_msg", "User password Updated Successfully");
          return res.redirect("back");
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
}); // Confirm user email

router.post("/user/dashboard/confirm-user-email", _auth["default"], /*#__PURE__*/function () {
  var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(req, res, next) {
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.prev = 0;

            if (req.body.ids) {
              _context11.next = 4;
              break;
            }

            req.flash("success_msg", "Nothing was Updated");
            return _context11.abrupt("return", res.redirect("back"));

          case 4:
            _context11.next = 6;
            return _users["default"].updateOne({
              _id: req.body.ids
            }, {
              $set: {
                active: true
              }
            });

          case 6:
            req.flash("success_msg", "Users Email Activated successfully");
            return _context11.abrupt("return", res.redirect("back"));

          case 10:
            _context11.prev = 10;
            _context11.t0 = _context11["catch"](0);
            next(_context11.t0);

          case 13:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, null, [[0, 10]]);
  }));

  return function (_x28, _x29, _x30) {
    return _ref11.apply(this, arguments);
  };
}()); // Ban user

router.post("/user/dashboard/ban-user", _auth["default"], (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(req, res, next) {
    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            _context12.prev = 0;

            if (req.body.ids) {
              _context12.next = 4;
              break;
            }

            req.flash("success_msg", "Nothing was Updated");
            return _context12.abrupt("return", res.redirect("back"));

          case 4:
            _context12.next = 6;
            return _users["default"].updateOne({
              _id: req.body.ids
            }, {
              $set: {
                banned: true
              }
            });

          case 6:
            req.flash("success_msg", "Users has been banned successfully");
            return _context12.abrupt("return", res.redirect("back"));

          case 10:
            _context12.prev = 10;
            _context12.t0 = _context12["catch"](0);
            next(_context12.t0);

          case 13:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12, null, [[0, 10]]);
  }));

  return function (_x31, _x32, _x33) {
    return _ref12.apply(this, arguments);
  };
}()); // Follow a user

router.get("/follow-user", _auth["default"], /*#__PURE__*/function () {
  var _ref13 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(req, res, next) {
    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            _context13.next = 2;
            return _users["default"].updateOne({
              _id: req.user.id
            }, {
              $push: {
                following: req.query.followerId
              }
            });

          case 2:
            req.flash("success_msg", "User added to followers list Successfully");
            return _context13.abrupt("return", res.redirect("back"));

          case 4:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13);
  }));

  return function (_x34, _x35, _x36) {
    return _ref13.apply(this, arguments);
  };
}()); // unfollow a user

router.get("/unfollow-user", _auth["default"], /*#__PURE__*/function () {
  var _ref14 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14(req, res, next) {
    return _regenerator["default"].wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            _context14.next = 2;
            return _users["default"].updateOne({
              _id: req.user.id
            }, {
              $pull: {
                following: req.query.followerId
              }
            });

          case 2:
            req.flash("success_msg", "User unfollowed successfully");
            return _context14.abrupt("return", res.redirect('back'));

          case 4:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14);
  }));

  return function (_x37, _x38, _x39) {
    return _ref14.apply(this, arguments);
  };
}()); // Subscribe a user to a newsletter digest (Daily / Weekly)

router.post("/subscribe/digest", _auth["default"], /*#__PURE__*/function () {
  var _ref15 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15(req, res, next) {
    return _regenerator["default"].wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15);
  }));

  return function (_x40, _x41, _x42) {
    return _ref15.apply(this, arguments);
  };
}());
module.exports = router;