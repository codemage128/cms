import express from "express";
import Settings from "../models/settings";
import auth from "../helpers/auth";
import role from "../helpers/role";
import fs from "fs";
import path from "path";
import formidable from "formidable";
import crypto from "crypto";
import AWS from "aws-sdk";
import install from "../helpers/install";
import User from "../models/users";
import util from "util";
import reques from "request";
import In from "../models/in";
let request = util.promisify(reques);
const router = express.Router();

const cloudinary = require("cloudinary").v2;

// General Settings Update
router.post(
  "/settings/general/update",
  auth,
  role("admin"),
  async (req, res, next) => {
    try {
      req.assert("siteName", "Site Name field cannot be blank").notEmpty();
      req
        .assert("siteDescription", "Site Description field cannot be blank")
        .notEmpty();
      const errors = req.validationErrors();
      if (errors) {
        req.flash("success_msg", errors[0].msg);
        return res.redirect("back");
      }
      let payload = {
        siteName: req.body.siteName.trim(),
        siteDescription: req.body.siteDescription.trim(),
        commentSystem: !req.body.commentSystem
          ? true
          : req.body.commentSystem == "enable"
          ? true
          : false,
        registrationSystem: !req.body.registrationSystem
          ? true
          : req.body.registrationSystem == "enable"
          ? true
          : false,
        copyright: req.body.copyright,
        googleAnalyticsCode: req.body.googleAnalyticsCode
      };
      let settings = await Settings.find();
      if (settings == "") {
        await Settings.create(payload);
        req.flash("success_msg", "General Info Has been Updated Successfully");
        return res.redirect("back");
      } else {
        let set = await Settings.find();
        await Settings.updateOne({ _id: set[0]._id }, payload);
        req.flash("success_msg", "General Info Has been Updated Successfully");
        return res.redirect("back");
      }
    } catch (error) {
      next(error);
    }
  }
);

// Contact settings update
router.post(
  "/settings/contact/update",
  auth,
  role("admin"),
  async (req, res, next) => {
    try {
      let settings = await Settings.find();
      if (settings == "") {
        await Settings.create(req.body);
        req.flash(
          "success_msg",
          "Contact Settings Has been Updated Successfully"
        );
        return res.redirect("back");
      } else {
        let set = await Settings.find();
        await Settings.updateOne({ _id: set[0]._id }, req.body);
        req.flash(
          "success_msg",
          "Contact Settings Has been Updated Successfully"
        );
        return res.redirect("back");
      }
    } catch (error) {
      next(error);
    }
  }
);

// Social media settings
router.post(
  "/settings/social/update",
  auth,
  role("admin"),
  async (req, res, next) => {
    try {
      let settings = await Settings.find();
      if (settings == "") {
        await Settings.create(req.body);
        req.flash(
          "success_msg",
          "Social Media Settings Has been Updated Successfully"
        );
        return res.redirect("back");
      } else {
        let set = await Settings.find();
        await Settings.updateOne({ _id: set[0]._id }, req.body);
        req.flash(
          "success_msg",
          "Social Media Settings Has been Updated Successfully"
        );
        return res.redirect("back");
      }
    } catch (error) {
      next(error);
    }
  }
);

// HTML head code settings
router.post(
  "/settings/html-code/update",
  auth,
  role("admin"),
  async (req, res, next) => {
    try {
      let settings = await Settings.find();
      if (settings == "") {
        await Settings.create(req.body);
        req.flash(
          "success_msg",
          "HTML head code Has been Updated Successfully"
        );
        return res.redirect("back");
      } else {
        let set = await Settings.find();
        await Settings.updateOne({ _id: set[0]._id }, req.body);
        req.flash(
          "success_msg",
          "HTML head code Has been Updated Successfully"
        );
        return res.redirect("back");
      }
    } catch (error) {
      next(error);
    }
  }
);

// Facebook Comments code settings
router.post(
  "/settings/facebook-comment/update",
  auth,
  role("admin"),
  async (req, res, next) => {
    try {
      let settings = await Settings.find();
      if (settings == "") {
        await Settings.create(req.body);
        req.flash(
          "success_msg",
          "Facebook Comments code Has been Updated Successfully"
        );
        return res.redirect("back");
      } else {
        let set = await Settings.find();
        await Settings.updateOne({ _id: set[0]._id }, req.body);
        req.flash(
          "success_msg",
          "Facebook Comments code Has been Updated Successfully"
        );
        return res.redirect("back");
      }
    } catch (error) {
      next(error);
    }
  }
);

// Update gmail settings
router.post(
  "/settings/email/gmail/update",
  auth,
  role("admin"),
  async (req, res, next) => {
    try {
      let settings = await Settings.find();
      if (settings == "") {
        await Settings.create(req.body);
        req.flash(
          "success_msg",
          "Gmail Settings Has been Updated Successfully"
        );
        return res.redirect("back");
      } else {
        let set = await Settings.find();
        await Settings.updateOne({ _id: set[0]._id }, req.body);
        req.flash(
          "success_msg",
          "Gmail Settings Has been Updated Successfully"
        );
        return res.redirect("back");
      }
    } catch (error) {
      next(error);
    }
  }
);

// Update sendgrid details
router.post(
  "/settings/email/sendgrid/update",
  auth,
  role("admin"),
  async (req, res, next) => {
    try {
      let settings = await Settings.find();
      if (settings == "") {
        await Settings.create(req.body);
        req.flash(
          "success_msg",
          "Sendgrid Settings Has been Updated Successfully"
        );
        return res.redirect("back");
      } else {
        let set = await Settings.find();
        await Settings.updateOne({ _id: set[0]._id }, req.body);
        req.flash(
          "success_msg",
          "Sendgrid Settings Has been Updated Successfully"
        );
        return res.redirect("back");
      }
    } catch (error) {
      next(error);
    }
  }
);

// Update AWS SES details
router.post(
  "/settings/email/aws/update",
  auth,
  role("admin"),
  async (req, res, next) => {
    try {
      let settings = await Settings.find();
      if (settings == "") {
        await Settings.create(req.body);
        req.flash(
          "success_msg",
          "AWS SES Settings Has been Updated Successfully"
        );
        return res.redirect("back");
      } else {
        let set = await Settings.find();
        await Settings.updateOne({ _id: set[0]._id }, req.body);
        req.flash(
          "success_msg",
          "AWS SES Settings Has been Updated Successfully"
        );
        return res.redirect("back");
      }
    } catch (error) {
      next(error);
    }
  }
);

// Update SMTP details
router.post(
  "/settings/email/smtp/update",
  auth,
  role("admin"),
  async (req, res, next) => {
    try {
      let settings = await Settings.find();
      if (settings == "") {
        await Settings.create(req.body);
        req.flash("success_msg", "SMTP Settings Has been Updated Successfully");
        return res.redirect("back");
      } else {
        let set = await Settings.find();
        await Settings.updateOne({ _id: set[0]._id }, req.body);
        req.flash("success_msg", "SMTP Settings Has been Updated Successfully");
        return res.redirect("back");
      }
    } catch (error) {
      next(error);
    }
  }
);

// Update email verification status
router.post(
  "/settings/email-verification/update",
  auth,
  role("admin"),
  async (req, res, next) => {
    try {
      let settings = await Settings.find();
      let payload = {
        emailVerification: !req.body.emailVerification
          ? req.body.emailVerification == false
          : req.body.emailVerification == "enable"
          ? true
          : false
      };
      if (settings == "") {
        await Settings.create(payload);
        if (req.body.emailVerification == "enable") {
          req.flash("success_msg", "Email verification has been enabled");
          return res.redirect("back");
        } else {
          req.flash("success_msg", "Email verification has been disabled");
          return res.redirect("back");
        }
      } else {
        let set = await Settings.find();
        await Settings.updateOne({ _id: set[0]._id }, payload);
        if (req.body.emailVerification == "enable") {
          req.flash("success_msg", "Email verification has been enabled");
          return res.redirect("back");
        } else {
          req.flash("success_msg", "Email verification has been disabled");
          return res.redirect("back");
        }
      }
    } catch (error) {
      next(error);
    }
  }
);

// Update Weekly Nnewsletter Status
router.post(
  "/settings/weekly-newsletter/update",
  auth,
  role("admin"),
  async (req, res, next) => {
    try {
      let settings = await Settings.find();
      let payload = {
        sendWeeklyNewsletter: !req.body.sendWeeklyNewsletter
          ? req.body.sendWeeklyNewsletter == true
          : req.body.sendWeeklyNewsletter == "enable"
          ? true
          : false
      };
      if (settings == "") {
        await Settings.create(payload);
        if (req.body.sendWeeklyNewsletter == "enable") {
          req.flash("success_msg", "Weekly Newsletter has been enabled");
          return res.redirect("back");
        } else {
          req.flash("success_msg", "Weekly Newsletter has been disabled");
          return res.redirect("back");
        }
      } else {
        let set = await Settings.find();
        await Settings.updateOne({ _id: set[0]._id }, payload);
        if (req.body.sendWeeklyNewsletter == "enable") {
          req.flash("success_msg", "Weekly Newsletter has been enabled");
          return res.redirect("back");
        } else {
          req.flash("success_msg", "Weekly Newsletter has been disabled");
          return res.redirect("back");
        }
      }
    } catch (error) {
      next(error);
    }
  }
);

// Update send contact to email status
router.post(
  "/settings/contact-to-email/update",
  auth,
  role("admin"),
  async (req, res, next) => {
    try {
      let settings = await Settings.find();
      let payload = {
        sendContactToEmail: !req.body.sendContactToEmail
          ? req.body.sendContactToEmail == false
          : req.body.sendContactToEmail == "enable"
          ? true
          : false,
        emailForContact: req.body.emailForContact
      };
      if (settings == "") {
        await Settings.create(payload);
        if (req.body.sendContactToEmail == "enable") {
          req.flash(
            "success_msg",
            "Contact Message will now be sent to your specified email address."
          );
          return res.redirect("back");
        } else {
          req.flash(
            "success_msg",
            "Contact Message will not be sent to your email address."
          );
          return res.redirect("back");
        }
      } else {
        let set = await Settings.find();
        await Settings.updateOne({ _id: set[0]._id }, payload);
        if (req.body.sendContactToEmail == "enable") {
          req.flash(
            "success_msg",
            "Contact Message will now be sent to your specified email address."
          );
          return res.redirect("back");
        } else {
          req.flash(
            "success_msg",
            "Contact Message will not be sent to your email address."
          );
          return res.redirect("back");
        }
      }
    } catch (error) {
      next(error);
    }
  }
);

// Update SMTP library
router.post(
  "/settings/email-lib/update",
  auth,
  role("admin"),
  async (req, res, next) => {
    try {
      let settings = await Settings.find();
      if (settings == "") {
        await Settings.create(req.body);
        req.flash("success_msg", "Email Library Has been Updated Successfully");
        return res.redirect("back");
      } else {
        let set = await Settings.find();
        await Settings.updateOne({ _id: set[0]._id }, req.body);
        req.flash("success_msg", "Email Library Has been Updated Successfully");
        return res.redirect("back");
      }
    } catch (error) {
      next(error);
    }
  }
);

// Update media AWS settings
router.post(
  "/settings/media/aws/update",
  auth,
  role("admin"),
  async (req, res, next) => {
    try {
      let settings = await Settings.find();
      if (settings == "") {
        await Settings.create(req.body);
        req.flash(
          "success_msg",
          "Amazon s3 info Has been Updated Successfully"
        );
        return res.redirect("back");
      } else {
        let set = await Settings.find();
        await Settings.updateOne({ _id: set[0]._id }, req.body);
        req.flash(
          "success_msg",
          "Amazon s3 info Has been Updated Successfully"
        );
        return res.redirect("back");
      }
    } catch (error) {
      next(error);
    }
  }
);

// Update media cloudinary settings
router.post(
  "/settings/media/cloudinary/update",
  auth,
  role("admin"),
  async (req, res, next) => {
    try {
      let settings = await Settings.find();
      if (settings == "") {
        await Settings.create(req.body);
        req.flash(
          "success_msg",
          "Cloudinary info Has been Updated Successfully"
        );
        return res.redirect("back");
      } else {
        let set = await Settings.find();
        await Settings.updateOne({ _id: set[0]._id }, req.body);
        req.flash(
          "success_msg",
          "Cloudinary info Has been Updated Successfully"
        );
        return res.redirect("back");
      }
    } catch (error) {
      next(error);
    }
  }
);

// Update back up storage
router.post(
  "/settings/media/back-up-storage/update",
  auth,
  role("admin"),
  async (req, res, next) => {
    try {
      let settings = await Settings.find();
      if (settings == "") {
        await Settings.create(req.body);
        req.flash("success_msg", "Media Storage has been updated Successfully");
        return res.redirect("back");
      } else {
        let set = await Settings.find();
        await Settings.updateOne({ _id: set[0]._id }, req.body);
        req.flash("success_msg", "Media Storage has been updated Successfully");
        return res.redirect("back");
      }
    } catch (error) {
      next(error);
    }
  }
);

// Update logo
router.post(
  "/settings/logo/update",
  auth,
  role("admin"),
  async (req, res, next) => {
    try {
      let settings = await Settings.find();
      if (settings == "") {
        let set = await Settings.findOne();
        switch (set.media.provider) {
          case "local":
            let localForm = new formidable.IncomingForm();
            localForm.parse(req, async function(err, fields, files) {});
            localForm.on("end", async function(fields, files) {
              for (let x in this.openedFiles) {
                let name =
                  this.openedFiles[x].name.split(".").shift() +
                  "-" +
                  crypto.randomBytes(2).toString("hex") +
                  "." +
                  this.openedFiles[x].name.split(".").pop();
                let dest = `${path.join(
                  __dirname,
                  "..",
                  "public",
                  "media",
                  name
                )}`;
                let data = fs.readFileSync(this.openedFiles[x].path);
                fs.writeFileSync(dest, data);
                fs.unlinkSync(this.openedFiles[x].path);
                let l = `/media/${name}`;
                await Settings.create({ siteLogo: l });
                req.flash("success_msg", "Logo Has Been Updated successfully");
                return res.redirect("back");
              }
            });
            break;
          case "amazons3":
            // AWS configuration
            let s3 = new AWS.S3({
              accessKeyId: set.media.config.amazons3.accessKeyId,
              secretAccessKey: set.media.config.amazons3.secretAccessKey,
              bucket: set.media.config.amazons3.bucket
            });
            let awsForm = new formidable.IncomingForm();
            awsForm.parse(req, (err, fields, files) => {});
            awsForm.on("end", function(fields, files) {
              for (let x in this.openedFiles) {
                let stream = fs.createReadStream(this.openedFiles[x].path);
                fs.unlinkSync(this.openedFiles[x].path);
                let params = {
                  Bucket: set.media.config.amazons3.bucket,
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
                    await Settings.create({ siteLogo: data.Location });
                    req.flash(
                      "success_msg",
                      "Logo Has Been Updated successfully"
                    );
                    return res.redirect("back");
                  }
                });
              }
            });
            break;
          case "cloudinary":
            // Cloudinary configuration
            cloudinary.config({
              cloud_name: set.media.config.cloudinary.cloud_name,
              api_key: set.media.config.cloudinary.api_key,
              api_secret: set.media.config.cloudinary.api_secret
            });
            let cloudForm = new formidable.IncomingForm();
            cloudForm.parse(req, function(err, fields, files) {});
            cloudForm.on("end", async function(fields, files) {
              for (let x in this.openedFiles) {
                cloudinary.uploader.upload(
                  this.openedFiles[x].path,
                  async (err, result) => {
                    fs.unlinkSync(this.openedFiles[x].path);
                    await Settings.create({ siteLogo: result.secure_url });
                    req.flash(
                      "success_msg",
                      "Logo Has Been Updated successfully"
                    );
                    return res.redirect("back");
                  }
                );
              }
            });
            break;
        }
      } else {
        let set = await Settings.find();
        switch (set[0].media.provider) {
          case "local":
            let localForm = new formidable.IncomingForm();
            localForm.parse(req, function(err, fields, files) {});
            localForm.on("end", async function(fields, files) {
              for (let x in this.openedFiles) {
                let name =
                  this.openedFiles[x].name.split(".").shift() +
                  "-" +
                  crypto.randomBytes(2).toString("hex") +
                  "." +
                  this.openedFiles[x].name.split(".").pop();
                let dest = `${path.join(
                  __dirname,
                  "..",
                  "public",
                  "media",
                  name
                )}`;
                let data = fs.readFileSync(this.openedFiles[x].path);
                fs.writeFileSync(dest, data);
                fs.unlinkSync(this.openedFiles[x].path);
                let logo = `/media/${name}`;
                await Settings.updateOne(
                  { _id: set[0]._id },
                  { siteLogo: logo }
                );
                req.flash("success_msg", "Logo Has Been Updated successfully");
                return res.redirect("back");
              }
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
                    await Settings.updateOne(
                      { _id: set[0]._id },
                      { siteLogo: data.Location }
                    );
                    req.flash(
                      "success_msg",
                      "Logo Has Been Updated successfully"
                    );
                    return res.redirect("back");
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
            cloudForm.on("end", function(fields, files) {
              for (let x in this.openedFiles) {
                cloudinary.uploader.upload(
                  this.openedFiles[x].path,
                  async (err, result) => {
                    fs.unlinkSync(this.openedFiles[x].path);
                    await Settings.updateOne(
                      { _id: set[0]._id },
                      { siteLogo: result.secure_url }
                    );
                    req.flash(
                      "success_msg",
                      "Logo Has Been Updated successfully"
                    );
                    return res.redirect("back");
                  }
                );
              }
            });
            break;
        }
      }
    } catch (error) {
      next(error);
    }
  }
);

// update site favicon
router.post(
  "/settings/favicon/update",
  auth,
  role("admin"),
  async (req, res, next) => {
    try {
      let settings = await Settings.find();
      if (settings == "") {
        let set = await Settings.findOne();
        switch (set.media.provider) {
          case "local":
            let localForm = new formidable.IncomingForm();
            localForm.parse(req, async function(err, fields, files) {});
            localForm.on("end", async function(fields, files) {
              for (let x in this.openedFiles) {
                let name =
                  this.openedFiles[x].name.split(".").shift() +
                  "-" +
                  crypto.randomBytes(2).toString("hex") +
                  "." +
                  this.openedFiles[x].name.split(".").pop();
                let dest = `${path.join(
                  __dirname,
                  "..",
                  "public",
                  "media",
                  name
                )}`;
                let data = fs.readFileSync(this.openedFiles[x].path);
                fs.writeFileSync(dest, data);
                fs.unlinkSync(this.openedFiles[x].path);
                let l = `/media/${name}`;
                await Settings.create({ favicon: l });
                req.flash(
                  "success_msg",
                  "favicon Has Been Updated successfully"
                );
                return res.redirect("back");
              }
            });
            break;
          case "amazons3":
            // AWS configuration
            let s3 = new AWS.S3({
              accessKeyId: set.media.config.amazons3.accessKeyId,
              secretAccessKey: set.media.config.amazons3.secretAccessKey,
              bucket: set.media.config.amazons3.bucket
            });
            let awsForm = new formidable.IncomingForm();
            awsForm.parse(req, (err, fields, files) => {});
            awsForm.on("end", function(fields, files) {
              for (let x in this.openedFiles) {
                let stream = fs.createReadStream(this.openedFiles[x].path);
                fs.unlinkSync(this.openedFiles[x].path);
                let params = {
                  Bucket: set.media.config.amazons3.bucket,
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
                    await Settings.create({ favicon: data.Location });
                    req.flash(
                      "success_msg",
                      "Favicon Has Been Updated successfully"
                    );
                    return res.redirect("back");
                  }
                });
              }
            });
            break;
          case "cloudinary":
            // Cloudinary configuration
            cloudinary.config({
              cloud_name: set.media.config.cloudinary.cloud_name,
              api_key: set.media.config.cloudinary.api_key,
              api_secret: set.media.config.cloudinary.api_secret
            });
            let cloudForm = new formidable.IncomingForm();
            cloudForm.parse(req, function(err, fields, files) {});
            cloudForm.on("end", async function(fields, files) {
              for (let x in this.openedFiles) {
                cloudinary.uploader.upload(
                  this.openedFiles[x].path,
                  async (err, result) => {
                    fs.unlinkSync(this.openedFiles[x].path);
                    await Settings.create({ favicon: result.secure_url });
                    req.flash(
                      "success_msg",
                      "Favicon Has Been Updated successfully"
                    );
                    return res.redirect("back");
                  }
                );
              }
            });
            break;
        }
      } else {
        let set = await Settings.find();
        switch (set[0].media.provider) {
          case "local":
            let localForm = new formidable.IncomingForm();
            localForm.parse(req, function(err, fields, files) {});
            localForm.on("end", async function(fields, files) {
              for (let x in this.openedFiles) {
                let name =
                  this.openedFiles[x].name.split(".").shift() +
                  "-" +
                  crypto.randomBytes(2).toString("hex") +
                  "." +
                  this.openedFiles[x].name.split(".").pop();
                let dest = `${path.join(
                  __dirname,
                  "..",
                  "public",
                  "media",
                  name
                )}`;
                let data = fs.readFileSync(this.openedFiles[x].path);
                fs.writeFileSync(dest, data);
                fs.unlinkSync(this.openedFiles[x].path);
                let logo = `/media/${name}`;
                await Settings.updateOne(
                  { _id: set[0]._id },
                  { favicon: logo }
                );
                req.flash(
                  "success_msg",
                  "Favicon Has Been Updated successfully"
                );
                return res.redirect("back");
              }
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
                    await Settings.updateOne(
                      { _id: set[0]._id },
                      { favicon: data.Location }
                    );
                    req.flash(
                      "success_msg",
                      "Favicon Has Been Updated successfully"
                    );
                    return res.redirect("back");
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
            cloudForm.on("end", function(fields, files) {
              for (let x in this.openedFiles) {
                cloudinary.uploader.upload(
                  this.openedFiles[x].path,
                  async (err, result) => {
                    fs.unlinkSync(this.openedFiles[x].path);
                    await Settings.updateOne(
                      { _id: set[0]._id },
                      { favicon: result.secure_url }
                    );
                    req.flash(
                      "success_msg",
                      "Favicon Has Been Updated successfully"
                    );
                    return res.redirect("back");
                  }
                );
              }
            });
            break;
        }
      }
    } catch (error) {
      next(error);
    }
  }
);

// facebook login update
router.post(
  "/settings/social-login/facebook/update",
  auth,
  role("admin"),
  async (req, res, next) => {
    try {
      let settings = await Settings.find();
      if (settings == "") {
        await Settings.create(req.body);
        req.flash(
          "success_msg",
          "Facebook Login Setting has been updated Successfully"
        );
        return res.redirect("back");
      } else {
        let set = await Settings.find();
        await Settings.updateOne({ _id: set[0]._id }, req.body);
        req.flash(
          "success_msg",
          "Facebook Login Setting has been updated Successfully"
        );
        return res.redirect("back");
      }
    } catch (error) {
      next(error);
    }
  }
);

// Google login update
router.post(
  "/settings/social-login/google/update",
  auth,
  role("admin"),
  async (req, res, next) => {
    try {
      let settings = await Settings.find();
      if (settings == "") {
        await Settings.create(req.body);
        req.flash(
          "success_msg",
          "Google Login Setting has been updated Successfully"
        );
        return res.redirect("back");
      } else {
        let set = await Settings.find();
        await Settings.updateOne({ _id: set[0]._id }, req.body);
        req.flash(
          "success_msg",
          "Google Login Setting has been updated Successfully"
        );
        return res.redirect("back");
      }
    } catch (error) {
      next(error);
    }
  }
);

// Twitter login update
router.post(
  "/settings/social-login/twitter/update",
  auth,
  role("admin"),
  async (req, res, next) => {
    try {
      let settings = await Settings.find();
      if (settings == "") {
        await Settings.create(req.body);
        req.flash(
          "success_msg",
          "Twitter Login Setting has been updated Successfully"
        );
        return res.redirect("back");
      } else {
        let set = await Settings.find();
        await Settings.updateOne({ _id: set[0]._id }, req.body);
        req.flash(
          "success_msg",
          "Twitter Login Setting has been updated Successfully"
        );
        return res.redirect("back");
      }
    } catch (error) {
      next(error);
    }
  }
);

// Vkon login update
router.post(
  "/settings/social-login/vkon/update",
  auth,
  role("admin"),
  async (req, res, next) => {
    try {
      let settings = await Settings.find();
      if (settings == "") {
        await Settings.create(req.body);
        req.flash(
          "success_msg",
          "VKontakte Login Setting has been updated Successfully"
        );
        return res.redirect("back");
      } else {
        let set = await Settings.find();
        await Settings.updateOne({ _id: set[0]._id }, req.body);
        req.flash(
          "success_msg",
          "VKontakte Login Setting has been updated Successfully"
        );
        return res.redirect("back");
      }
    } catch (error) {
      next(error);
    }
  }
);

// Preferences settings update
router.post(
  "/setting/preferences/update",
  auth,
  role("admin"),
  async (req, res, next) => {
    try {
      let payload = {
        slider: !req.body.slider
          ? true
          : req.body.slider == "enable"
          ? true
          : false,
        registrationSystem: !req.body.registrationSystem
          ? true
          : req.body.registrationSystem == "enable"
          ? true
          : false,
        facebookLogin: !req.body.facebookLogin
          ? true
          : req.body.facebookLogin == "enable"
          ? true
          : false,
        twitterLogin: !req.body.twitterLogin
          ? true
          : req.body.twitterLogin == "enable"
          ? true
          : false,
        googleLogin: !req.body.googleLogin
          ? true
          : req.body.googleLogin == "enable"
          ? true
          : false,
        vkontakteLogin: !req.body.vkontakteLogin
          ? true
          : req.body.vkontakteLogin == "enable"
          ? true
          : false,
        commentSystem: !req.body.commentSystem
          ? true
          : req.body.commentSystem == "enable"
          ? true
          : false,
        facebookComment: !req.body.facebookComment
          ? true
          : req.body.facebookComment == "enable"
          ? true
          : false,
        emojiReaction: !req.body.emojiReaction
          ? true
          : req.body.emojiReaction == "enable"
          ? true
          : false,
        newsletter: !req.body.newsletter
          ? true
          : req.body.newsletter == "enable"
          ? true
          : false,
        showPostAuthor: !req.body.showPostAuthor
          ? true
          : req.body.showPostAuthor == "enable"
          ? true
          : false,
        showPostDate: !req.body.showPostDate
          ? true
          : req.body.showPostDate == "enable"
          ? true
          : false,
        showPostViewCount: !req.body.showPostViewCount
          ? true
          : req.body.showPostViewCount == "enable"
          ? true
          : false,
        approveAddedUserPost: !req.body.approveAddedUserPost
          ? true
          : req.body.approveAddedUserPost == "enable"
          ? true
          : false,
        approveUpdatedUserPost: !req.body.approveUpdatedUserPost
          ? true
          : req.body.approveUpdatedUserPost == "enable"
          ? true
          : false,
        textAsIcon: !req.body.textAsIcon
          ? false
          : req.body.textAsIcon == "enable"
          ? true
          : false,
        approveComment: !req.body.approveComment
          ? true
          : req.body.approveComment == "enable"
          ? true
          : false,
        autoLogin: !req.body.autoLogin
          ? true
          : req.body.autoLogin == "enable"
          ? true
          : false
      };
      let set = await Settings.find();
      await Settings.updateOne({ _id: set[0]._id }, payload);
      req.flash("success_msg", "Preferences has been updated Successfully");
      return res.redirect("back");
    } catch (error) {
      next(error);
    }
  }
);

router.get("/install", install.redirect, (req, res, next) => {
  res.render("install");
});

router.get(
  "/install/settings",
  install.disableInstallPage,
  (req, res, next) => {
    res.render("install-settings");
  }
);

router.get("/install/admin", install.redirectToAdmin, (req, res, next) => {
  res.render("install-admin");
});

router.post("/verify/purchase", async (req, res, next) => {
  req.assert("code", "pls enter a purchase code").notEmpty();
  const err = req.validationErrors();
  if (err) {
    req.flash("success_msg", err[0].msg);
    res.redirect("back");
  }
  const option = {
    url: "https://Dype-server.herokuapp.com",
    method: "POST",
    form: {
      code: req.body.code,
      agent: `${req.protocol}://${req.headers.host}`
    }
  };
  request(option)
    .then(async response => {
      switch (response.statusCode) {
        case 200:
          await In.create({ yes: true });
          res.redirect("/install/settings");
          break;
        case 404:
          req.flash("success_msg", response.body);
          res.redirect("back");
          break;
        default:
          break;
      }
    })
    .catch(e => {
      req.flash("success_msg", "Internal server error, pls try again");
      return res.redirect("back");
    });
});

router.post("/install", install.disableInstallPage, (req, res, next) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    const logo = files.siteLogo;
    const favicon = files.favicon;
    const body = fields;
    const name1 = `${crypto
      .randomBytes(20)
      .toString("hex")}${Date.now().toString()}.${logo.name.split(".").pop()}`;
    const name2 = `${crypto
      .randomBytes(20)
      .toString("hex")}${Date.now().toString()}.${favicon.name
      .split(".")
      .pop()}}`;
    const dest1 = `${path.join(
      __dirname,
      "..",
      "public",
      "media",
      `${name1}`
    )}`;
    const dest2 = `${path.join(
      __dirname,
      "..",
      "public",
      "media",
      `${name2}`
    )}`;
    const data1 = fs.readFileSync(logo.path);
    const data2 = fs.readFileSync(favicon.path);
    fs.writeFileSync(dest1, data1);
    fs.writeFileSync(dest2, data2);
    fs.unlinkSync(logo.path);
    fs.unlinkSync(favicon.path);
    let payload = {
      siteLogo: `/media/${name1}`,
      favicon: `/media/${name2}`,
      siteUrl: `${req.headers.host}`,
      siteName: body.siteName,
      siteDescription: body.siteDescription
    };
    await Settings.create(payload);
    req.flash(
      "success_msg",
      "Settings Created successfully, now create the admin account"
    );
    return res.redirect("/install/admin");
  });
});

router.post("/install/admin", async (req, res, next) => {
  req.assert("email", "Email Field cannot be blank").notEmpty();
  req.assert("password", "Password Field cannot be blank").notEmpty();
  req.assert("username", "username field cannot be blank").notEmpty();
  req.assert("firstName", "First name field cannot be blank").notEmpty();
  req.assert("lastName", "Last Name field cannot be blank").notEmpty();
  const error = req.validationErrors();
  if (error) {
    req.flash("success_msg", error[0].msg);
    return res.redirect("back");
  }
  req.body.active = true;
  req.body.roleId = "admin";
  req.body.about = "No info for now";
  req.body.profilePicture =
    "https://gravatar.com/avatar/" +
    crypto
      .createHash("md5")
      .update(req.body.email)
      .digest("hex")
      .toString() +
    "?s=200" +
    "&d=retro";
  let user = await User.create(req.body);
  req.logIn(user, err => {
    if (err) next(err);
    res.redirect("/dashboard/index");
  });
});

module.exports = router;
