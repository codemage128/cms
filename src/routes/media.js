import express from "express";
import formidable from "formidable";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import Media from "../models/media";
import auth from "../helpers/auth";
import Settings from "../models/settings";
import AWS from "aws-sdk";
const router = express.Router();

const cloudinary = require("cloudinary").v2;

// Create a new file
router.post("/media/create", async (req, res, next) => {
  try {
    let set = await Settings.findOne();
    switch (set.media.provider) {
      case "local":
        let localForm = new formidable.IncomingForm();
        localForm.parse(req, function(err, fields, files) {});
        localForm.on("end", function(fields, files) {
          for (let x in this.openedFiles) {
            let name =
              this.openedFiles[x].name.split(".").shift() +
              "-" +
              crypto.randomBytes(2).toString("hex") +
              "." +
              this.openedFiles[x].name.split(".").pop();
            let dest = `${path.join(__dirname, "..", "public", "media", name)}`;
            let data = fs.readFileSync(this.openedFiles[x].path);
            fs.writeFileSync(dest, data);
            fs.unlinkSync(this.openedFiles[x].path);
            let img = new Media();
            img.file_size = this.openedFiles[x].size;
            img.file_type = this.openedFiles[x].type;
            img.postedBy = req.user.id;
            img.file_name = `/media/${name}`;
            img.file_extension = this.openedFiles[x].name.split(".").pop();
            img
              .save()
              .then(done => res.status(200).json(done))
              .catch(e => next(e));
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
            s3.upload(params, function(err, data) {
              if (err) next(err);
              else {
                let img = new Media();
                img.file_size = awsForm.openedFiles[x].size;
                img.file_type = awsForm.openedFiles[x].type;
                img.postedBy = req.user.id;
                img.file_name = data.Location;
                img.file_extension = awsForm.openedFiles[x].name
                  .split(".")
                  .pop();
                img
                  .save()
                  .then(done => res.status(200).json(done))
                  .catch(e => next(e));
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
        cloudForm.on("end", function(fields, files) {
          for (let x in this.openedFiles) {
            cloudinary.uploader.upload_large(
              this.openedFiles[x].path,
              { resource_type: "raw" },
              (err, result) => {
                fs.unlinkSync(this.openedFiles[x].path);
                let img = new Media();
                img.file_size = this.openedFiles[x].size;
                img.file_type = this.openedFiles[x].type;
                img.postedBy = req.user.id;
                img.file_name = result.secure_url;
                img.file_extension = this.openedFiles[x].name.split(".").pop();
                img
                  .save()
                  .then(done => res.status(200).json(done))
                  .catch(e => next(e));
              }
            );
          }
        });
        break;
    }
  } catch (error) {
    next(error);
  }
});

// Delete a media
router.post("/media/delete", auth, (req, res, next) => {
  try {
    Media.deleteOne({ _id: req.body.mediaId.trim() })
      .then(deleted => {
        req.flash("success_msg", "Media has been deleted successfully");
        return res.redirect("back");
      })
      .catch(e => next(e));
  } catch (error) {
    next(error);
  }
});

router.get("/media/getLists", auth, async (req, res, next) => {
  let perPage = 35;
  let page = req.query.page || 1;
  if (req.user.roleId == "admin") {
    if (req.query.s) {
      let data = await Media.find({
        file_type: { $regex: req.query.file_type, $options: "$i" },
        file_name: { $regex: req.query.s, $options: "$i" }
      })
        .skip(perPage * page - perPage)
        .limit(perPage)
        .sort({ createdAt: -1 });
      let count = await Media.countDocuments({
        file_type: { $regex: req.query.file_type, $options: "$i" },
        file_name: { $regex: req.query.s, $options: "$i" }
      });
      let re = {
        current: req.query.page,
        total: count,
        data: data,
        page: Math.ceil(count / perPage)
      };
      res.send(re);
    } else {
      let data = await Media.find({
        file_type: { $regex: req.query.file_type, $options: "$i" }
      })
        .skip(perPage * page - perPage)
        .limit(perPage)
        .sort({ createdAt: -1 });
      let count = await Media.countDocuments({
        file_type: { $regex: req.query.file_type, $options: "$i" }
      });
      let re = {
        current: req.query.page,
        total: count,
        data: data,
        page: Math.ceil(count / perPage)
      };
      res.send(re);
    }
  } else {
    if (req.query.s) {
      let data = await Media.find({
        postedBy: req.user.id,
        file_type: { $regex: req.query.file_type, $options: "$i" },
        file_name: { $regex: req.query.s, $options: "$i" }
      })
        .skip(perPage * page - perPage)
        .limit(perPage)
        .sort({ createdAt: -1 });
      let count = await Media.countDocuments({
        postedBy: req.user.id,
        file_type: { $regex: req.query.file_type, $options: "$i" },
        file_name: { $regex: req.query.s, $options: "$i" }
      });
      let re = {
        current: req.query.page,
        total: count,
        data: data,
        page: Math.ceil(count / perPage)
      };
      res.send(re);
    } else {
      let data = await Media.find({
        postedBy: req.user.id,
        file_type: { $regex: req.query.file_type, $options: "$i" }
      })
        .skip(perPage * page - perPage)
        .limit(perPage)
        .sort({ createdAt: -1 });
      let count = await Media.countDocuments({
        postedBy: req.user.id,
        file_type: { $regex: req.query.file_type, $options: "$i" }
      });
      let re = {
        current: req.query.page,
        total: count,
        data: data,
        page: Math.ceil(count / perPage)
      };
      res.send(re);
    }
  }
});

module.exports = router;
