"use strict";

import express from "express";
import User from "../models/users";
import crypto from "crypto";
import formidable from "formidable";
import _mail from "../helpers/_mail";
import Settings from "../models/settings";
import passport from "../helpers/passport";
import fs from "fs";
import path from "path";
import auth from "../helpers/auth";
import AWS from "aws-sdk";
import { v2 as cloudinary } from "cloudinary";
import Article from "../models/articles";
const router = express.Router();
import install from "../helpers/install";
import role from "../helpers/role";
import Newsletter from "../models/newsletter";

// Prevent logged in users from viewing the sign up and login page
function checkIfLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return res.redirect(`back`);
  else {
    next();
  }
}

// Facebook Login auth
router.get(
  "/auth/facebook",
  install.redirectToLogin,
  passport.authenticate("facebook", { scope: ["email"] })
);
router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/login",
    successRedirect: "/"
  })
);

// Google login auth
router.get(
  "/auth/google",
  install.redirectToLogin,
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    successRedirect: "/"
  })
);

// Twitter login auth
router.get(
  "/auth/twitter",
  install.redirectToLogin,
  passport.authenticate("twitter")
);
router.get(
  "/auth/twitter/callback",
  passport.authenticate("twitter", {
    failureRedirect: "/login",
    successRedirect: "/"
  })
);

// Vkontakte login auth
router.get(
  "/auth/vkontakte",
  install.redirectToLogin,
  passport.authenticate("vkontakte", { scope: ["email"] })
);
router.get(
  "/auth/vkontakte/callback",
  passport.authenticate("vkontakte", {
    failureRedirect: "/login",
    successRedirect: "/"
  })
);

// Get sign up page
router.get(
  "/sign-up",
  install.redirectToLogin,
  checkIfLoggedIn,
  (req, res, next) => {
    res.render("sign-up");
  }
);

// Create a new user
router.post(
  "/sign-up",
  install.redirectToLogin,
  checkIfLoggedIn,
  async (req, res, next) => {
    try {
      let set = await Settings.findOne();
      // SOLVED SETTINGS BUG, USED SET[0] INSTEAD OF SET
      if (set.registrationSystem == true) {
        let payload = {
          email: req.body.email.trim(),
          password: req.body.password.trim(),
          token: crypto.randomBytes(16).toString("hex"),
          username: req.body.username.trim(),
          profilePicture:
            "https://gravatar.com/avatar/" +
            crypto
              .createHash("md5")
              .update(req.body.email)
              .digest("hex")
              .toString() +
            "?s=200" +
            "&d=retro",
          active:
            typeof set.emailVerification == "undefined"
              ? true
              : set.emailVerification == true
              ? false
              : true,
          roleId: "user",
          firstName: "Not Specified",
          lastName: "Not Specified",
          siteLink: res.locals.siteLink,
          logo: res.locals.siteLogo,
          instagram: res.locals.instagram,
          facebook: res.locals.facebook,
          twitter: res.locals.twitter
        };
        if (req.body.password !== req.body.cPassword) {
          req.flash("success_msg", "Password Does/'nt match");
          return res.redirect("back");
        } else {
          let check = await User.findOne({ email: req.body.email });
          if (check) {
            req.flash("success_msg", "Email has been used");
            return res.redirect("back");
          } else {
            let user = await User.create(payload);
            // SOLVED SETTINGS BUG, USED SET[0] INSTEAD OF SET
            set.emailVerification == true
              ? await _mail(
                  "Registration Successfull",
                  req.body.email,
                  "reg-email",
                  payload,
                  req.headers.host,
                  (err, info) => {
                    if (err) console.log(err);
                  }
                )
              : null;
            if (set.emailVerification == true) {
              req.flash(
                "success_msg",
                "Registration Successfull, pls check your email for futher instrcutions"
              );
              return res.redirect("back");
            } else {
              if (set.autoLogin == true) {
                req.logIn(user, function(err) {
                  if (err) return next(err);
                  if (user.roleId === "user") {
                    return res.redirect(`/user/dashboard`);
                  } else if (user.roleId === "admin") {
                    return res.redirect(`/dashboard/index`);
                  }
                });
              } else {
                req.flash("success_msg", "Registration Successfull");
                return res.redirect("/login");
              }
            }
          }
        }
      } else {
        res.render("404");
      }
    } catch (e) {
      next(e);
    }
  }
);

// Create a new user manually
router.post("/user/create", install.redirectToLogin, async (req, res, next) => {
  try {
    req.body.roleId = !req.body.roleId ? "user" : req.body.roleId;
    req.body.email = req.body.email.trim();
    req.body.password = req.body.password.trim();
    req.body.username = req.body.username.trim();
    req.body.active = true;
    req.body.firstName =
      req.body.firstName == "" ? "Not Specified" : req.body.firstName;
    req.body.lastName =
      req.body.lastName == "" ? "Not Specified" : req.body.lastName;
    req.body.profilePicture =
      "https://gravatar.com/avatar/" +
      crypto
        .createHash("md5")
        .update(req.body.email)
        .digest("hex")
        .toString() +
      "?s=200" +
      "&d=retro";
    let check = await User.findOne({ email: req.body.email });
    let username = await User.findOne({ username: req.body.username });
    if (check || username) {
      req.flash("success_msg", `${check ? "Email" : "Username"} has been used`);
      return res.redirect("back");
    } else {
      req.body.siteLink = res.locals.siteLink;
      req.body.logo = res.locals.siteLogo;
      req.body.instagram = res.locals.instagram;
      req.body.facebook = res.locals.facebook;
      req.body.twitter = res.locals.twitter;
      let payload = req.body;
      await User.create(req.body);
      await _mail(
        "Registration Successfull",
        req.body.email,
        "reg-email2",
        payload,
        req.headers.host,
        (err, info) => {
          if (err) console.log(err);
        }
      );
      req.flash("success_msg", "User Created Successfully");
      return res.redirect("back");
    }
  } catch (e) {
    next(e);
  }
});

// Verify a user account route
router.get(
  "/verify-account",
  install.redirectToLogin,
  checkIfLoggedIn,
  async (req, res, next) => {
    let set = await Settings.findOne();
    try {
      if (req.query.token) {
        // check if the token exist
        User.findOne({ token: req.query.token }).then(user => {
          if (!user) {
            req.flash(
              "success_msg",
              "The token is inavlid, pls check your mail again"
            );
            return res.redirect("back");
          } else {
            user.token = undefined;
            user.active = true;
            user.verified = true;
            user
              .save()
              .then(user => {
                if (set.autoLogin) {
                  req.logIn(user, (err, user) => {
                    if (err) return next(err);
                    return res.redirect(`/user/dashboard`);
                  });
                } else {
                  req.flash(
                    "success_msg",
                    "Account Verified Successfully, you can now login."
                  );
                  res.redirect("/login");
                }
              })
              .catch(err => next(err));
          }
        });
      } else {
        res.render("404");
      }
    } catch (e) {
      next(e);
    }
  }
);

// Get login route
router.get(
  "/login",
  install.redirectToLogin,
  checkIfLoggedIn,
  (req, res, next) => {
    res.render("login", { title: res.locals.siteTitle });
  }
);
router.post(
  "/login",
  install.redirectToLogin,
  checkIfLoggedIn,
  (req, res, next) => {
    passport.authenticate("local", function(err, user, info) {
      if (err) return next(err);
      if (!user) {
        req.flash("success_msg", "Incorect Email or password");
        return res.redirect("back");
      }
      if (typeof user.active == "boolean" && user.active === false) {
        req.flash(
          "success_msg",
          "Your account is not active, check your email to activate your account"
        );
        return res.redirect("back");
      }
      if (user.banned === true) {
        req.flash(
          "success_msg",
          "Your Account has been suspended, You can visit the contact page for help."
        );
      }
      req.logIn(user, function(err) {
        if (err) return next(err);
        if (user.roleId === "user") {
          return res.redirect(`/user/dashboard`);
        } else if (user.roleId === "admin") {
          return res.redirect(`/dashboard/index`);
        }
      });
    })(req, res, next);
  }
);

// Get forgot password page
router.get(
  "/forgot-password",
  install.redirectToLogin,
  checkIfLoggedIn,
  (req, res, next) => {
    res.render("forgot-pass", { title: res.locals.siteTitle });
  }
);

// Forgot password route
router.post("/forgot-password", install.redirectToLogin, (req, res, next) => {
  try {
    const token = crypto.randomBytes(20).toString("hex");
    // Check the database if there's any user with the specified user
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          // user does not exist
          req.flash("success_msg", "Email does not match with any account");
          return res.redirect("back");
        } else {
          user.passwordResetToken = token;
          user.passwordResetExpiryDate = Date.now() + 3600000; // 1 hour
          user
            .save()
            .then(user => {
              const emailVariables = {
                email: user.email,
                token: user.passwordResetToken
              };
              _mail(
                "Forgotten Passwird",
                user.email,
                "forgot-email",
                emailVariables,
                req.headers.host,
                (err, info) => {
                  console.log(info.response);
                }
              );
              req.flash(
                "success_msg",
                "An email has been sent to your account with further instructions"
              );
              return res.redirect("back");
            })
            .catch(err => next(err));
        }
      })
      .catch(err => next(err));
  } catch (e) {
    next(e);
  }
});

// Get resest password page
router.get("/reset/:token", install.redirectToLogin, (req, res, next) => {
  res.render("reset", { title: res.locals.siteTitle });
});

// Reset password route
router.post("/reset/:token", install.redirectToLogin, (req, res, next) => {
  try {
    User.findOne({
      passwordResetToken: req.params.token,
      passwordResetExpiryDate: { $gt: Date.now() }
    }).then(user => {
      if (!user) {
        req.flash("success_msg", "Token is invalid or it might has expired");
        return res.redirect("back");
      } else {
        user.passwordResetToken = undefined;
        user.passwordResetExpiryDate = undefined;
        user.password = req.body.password;
        user
          .save()
          .then(user => {
            req.flash(
              "success_msg",
              "Your password has been updated successfully, you can now login"
            );
            return res.redirect("/login");
          })
          .catch(err => next(err));
      }
    });
  } catch (e) {
    next(e);
  }
});

// Update user info route
router.post(
  "/user/dashboard/update/info",
  install.redirectToLogin,
  auth,
  async (req, res, next) => {
    try {
      let user = await User.findById(req.user.id);
      if (user.email == req.body.email) {
        User.updateOne({ _id: req.user.id }, req.body)
          .then(user => {
            req.flash(
              "success_msg",
              "Your profile has been updated successfully"
            );
            return res.redirect("back");
          })
          .catch(err => next(err));
      } else {
        let use = await User.findOne({ email: req.body.email });
        if (use) {
          req.flash("success_msg", "The Email you provided has been used");
          return res.redirect("back");
        } else {
          User.updateOne({ _id: req.user.id }, req.body)
            .then(user => {
              req.flash(
                "success_msg",
                "Your profile has been updated successfully"
              );
              return res.redirect("back");
            })
            .catch(err => next(err));
        }
      }
    } catch (e) {
      next(e);
    }
  }
);

// Update user profile picture
/**
 * @TODO retructure how name is been saved
 */
router.post(
  "/user/dashboard/update/profile-picture",
  install.redirectToLogin,
  auth,
  async (req, res, next) => {
    try {
      let set = await Settings.find();
      switch (set[0].media.provider) {
        case "local":
          const form = new formidable.IncomingForm();
          form.parse(req, (err, fields, files) => {
            const fileUpload = files.profilePicture;
            const uploadedData = fields;
            const name = `${crypto
              .randomBytes(20)
              .toString("hex")}${Date.now().toString()}.${fileUpload.name
              .split(".")
              .pop()}`;
            const dest = `${path.join(
              __dirname,
              "..",
              "public",
              "media",
              `${name}`
            )}`;
            const data = fs.readFileSync(fileUpload.path);
            fs.writeFileSync(dest, data);
            fs.unlinkSync(fileUpload.path);
            uploadedData.profilePicture = `/media/${name}`;
            User.updateOne(
              { _id: req.user.id },
              { $set: { profilePicture: uploadedData.profilePicture } }
            )
              .then(user => {
                req.flash(
                  "success_msg",
                  "Profile Picture has been updated successfully"
                );
                return res.redirect("back");
              })
              .catch(err => next(err));
          });
          break;
        case "amazons3":
          // AWS configuration
          let s3 = new AWS.S3({
            accessKeyId: set[0].media.config.amazons3.accessKeyId,
            secretAccessKey: set[0].media.config.amazons3.secretAccessKey,
            bucket: set[0].media.config.amazons3.bucket
          });
          let awsForm = new formidable.IncomingForm();
          awsForm.parse(req, (err, fields, files) => {});
          awsForm.on("end", function(fields, files) {
            for (let x in this.openedFiles) {
              let stream = fs.createReadStream(this.openedFiles[x].path);
              fs.unlinkSync(this.openedFiles[x].path);
              let params = {
                Bucket: set[0].media.config.amazons3.bucket,
                Key:
                  this.openedFiles[x].name.split(".").shift() +
                  "-" +
                  crypto.randomBytes(2).toString("hex") +
                  "." +
                  this.openedFiles[x].name.split(".").pop(),
                Body: stream,
                ContentType: this.openedFiles[x].type,
                ACL: "public-read",
                processData: false
              };
              s3.upload(params, async function(err, data) {
                if (err) next(err);
                else {
                  User.updateOne(
                    { _id: req.user.id },
                    { $set: { profilePicture: data.Location } }
                  )
                    .then(user => {
                      req.flash(
                        "success_msg",
                        "Profile Picture has been updated successfully"
                      );
                      return res.redirect("back");
                    })
                    .catch(err => next(err));
                }
              });
            }
          });
          break;
        case "cloudinary":
          // Cloudinary configuration
          cloudinary.config({
            cloud_name: set[0].media.config.cloudinary.cloud_name,
            api_key: set[0].media.config.cloudinary.api_key,
            api_secret: set[0].media.config.cloudinary.api_secret
          });
          let cloudForm = new formidable.IncomingForm();
          cloudForm.parse(req, function(err, fields, files) {});
          cloudForm.on("end", async function(fields, files) {
            for (let x in this.openedFiles) {
              cloudinary.uploader.upload(
                this.openedFiles[x].path,
                async (err, result) => {
                  fs.unlinkSync(this.openedFiles[x].path);
                  User.updateOne(
                    { _id: req.user.id },
                    { $set: { profilePicture: result.secure_url } }
                  )
                    .then(user => {
                      req.flash(
                        "success_msg",
                        "Profile Picture has been updated successfully"
                      );
                      return res.redirect("back");
                    })
                    .catch(err => next(err));
                }
              );
            }
          });
          break;
      }
    } catch (e) {
      next(e);
    }
  }
);

// Update user password
router.post(
  "/user/dashboard/update/password",
  install.redirectToLogin,
  auth,
  (req, res, next) => {
    try {
      User.findOne({ _id: req.user.id })
        .then(user => {
          user.comparePassword(req.body.currentPassword, (err, isMatch) => {
            if (isMatch == true) {
              if (req.body.password.trim().length > 1) {
                user.password = req.body.password;
                user
                  .save()
                  .then(user => {
                    req.flash("success_msg", "Your password has been updated");
                    return res.redirect("back");
                  })
                  .catch(err => next(err));
              } else {
                req.flash(
                  "success_msg",
                  "password field cannot be empty or too short"
                );
                return res.redirect("back");
              }
            } else {
              req.flash(
                "success_msg",
                "The current password you provided is incorrect"
              );
              return res.redirect("back");
            }
          });
        })
        .catch(err => next(err));
    } catch (e) {
      next(e);
    }
  }
);

// Log out route
router.get("/log-out", (req, res, next) => {
  try {
    if (!req.user) res.redirect("/login");
    else {
      User.updateOne({ _id: req.user.id }, { lastLoggedIn: Date.now() }).then(
        updated => {
          req.logout();
          req.flash("success_msg", "You are now logged out");
          res.redirect("/login");
        }
      );
    }
  } catch (error) {
    next(error);
  }
});

// Delete Many User
router.post(
  "/user/dashboard/deleteMany",
  install.redirectToLogin,
  auth,
  async (req, res, next) => {
    try {
      await Article.deleteMany({ postedBy: req.body.ids });
      User.deleteMany({ _id: req.body.ids })
        .then(deleted => {
          if (!req.body.ids) {
            req.flash("success_msg", "No User Was Deleted");
            return res.redirect("back");
          } else {
            req.flash("success_msg", "Users was Deleted Successfully");
            return res.redirect("back");
          }
        })
        .catch(e => next(e));
    } catch (error) {
      next(error);
    }
  }
);

// Update another user info
router.post("/user/edit", auth, async (req, res, next) => {
  try {
    let user = await User.findById(req.body.userId);
    if (user.email == req.body.email) {
      User.updateOne({ _id: req.body.userId }, req.body)
        .then(user => {
          req.flash(
            "success_msg",
            "User's profile has been updated successfully"
          );
          return res.redirect("back");
        })
        .catch(err => next(err));
    } else {
      let use = await User.findOne({ email: req.body.email });
      if (use) {
        req.flash("success_msg", "The Email you provided has been used");
        return res.redirect("back");
      } else {
        User.updateOne({ _id: req.body.userId }, req.body)
          .then(user => {
            req.flash(
              "success_msg",
              "User's profile has been updated successfully"
            );
            return res.redirect("back");
          })
          .catch(err => next(err));
      }
    }
  } catch (e) {
    next(e);
  }
});

// Update another user password
router.post("/user/password/edit", auth, (req, res, next) => {
  try {
    if (req.body.password !== req.body.repassword) {
      req.flash("success_msg", "Password doesn't match");
      return res.redirect("back");
    } else {
      User.findOne({ _id: req.body.userId })
        .then(user => {
          user.password = req.body.password;
          user
            .save()
            .then(saved => {
              req.flash("success_msg", "User password Updated Successfully");
              return res.redirect("back");
            })
            .catch(e => next(e));
        })
        .catch(e => next(e));
    }
  } catch (error) {
    next(error);
  }
});

// Confirm user email
router.post(
  "/user/dashboard/confirm-user-email",
  auth,
  async (req, res, next) => {
    try {
      if (!req.body.ids) {
        req.flash("success_msg", "Nothing was Updated");
        return res.redirect("back");
      }
      await User.updateOne({ _id: req.body.ids }, { $set: { active: true } });
      req.flash("success_msg", "Users Email Activated successfully");
      return res.redirect("back");
    } catch (error) {
      next(error);
    }
  }
);

// Ban user
router.post(
  "/user/dashboard/ban-user",
  auth,
  role("admin"),
  async (req, res, next) => {
    try {
      if (!req.body.ids) {
        req.flash("success_msg", "Nothing was Updated");
        return res.redirect("back");
      }
      await User.updateOne({ _id: req.body.ids }, { $set: { banned: true } });
      req.flash("success_msg", "Users has been banned successfully");
      return res.redirect("back");
    } catch (error) {
      next(error);
    }
  }
);

// Follow a user
router.get("/follow-user", auth, async (req, res, next) => {
  await User.updateOne(
    { _id: req.user.id },
    { $push: { following: req.query.followerId } }
  );
  req.flash("success_msg", "User added to followers list Successfully");
  return res.redirect("back");
});

// unfollow a user
router.get("/unfollow-user", auth, async (req, res, next) => {
  await User.updateOne(
    { _id: req.user.id },
    { $pull: { following: req.query.followerId } }
  );
  req.flash("success_msg", "User unfollowed successfully");
  return res.redirect('back')
});

// Subscribe a user to a newsletter digest (Daily / Weekly)
router.post("/subscribe/digest", auth, async (req, res, next) => {});

module.exports = router;
