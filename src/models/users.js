import mongoose from "mongoose";
import bcrypt from "bcrypt-nodejs";
import crypto from "crypto";
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: String,
    email: {
      type: String,
      unique: true
    },
    password: String,
    profilePicture: {
      type: String,
      default: "https://gravatar.com/avatar/?s=200&d=retro"
    },
    active: {
      type: Boolean,
      default: false
    },
    banned: {
      type: Boolean,
      default: false
    },
    roleId: {
      type: String,
      enum: ["admin", "user"],
      default: "user"
    },
    about: String,
    firstName: String,
    lastName: String,
    lastLoggedIn: Date,
    token: String,
    passwordResetToken: String,
    passwordResetExpiryDate: Date,
    social: {
      facebook: String,
      twitter: String,
      instagram: String,
      pinterest: String
    },
    provider: String,
    facebookId: String,
    twitterId: String,
    instagramId: String,
    googleId: String,
    vkontakteId: String,
    following: Array
  },
  { timestamps: true }
);

//Hash password with bcrypt before saving
userSchema.pre("save", function(next) {
  var user = this;
  var SALT_FACTOR = 12;

  if (!user.isModified("password")) return next();

  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.gravatar = function(size, defaults) {
  if (!size) size = 200;
  if (!defaults) defaults = "retro";

  if (!this.email) {
    return "https://gravatar.com/avatar/?s=" + size + "&d=" + defaults;
  }

  const md5 = crypto.createHash("md5").update(this.email);
  return (
    "https://gravatar.com/avatar/" +
    md5.digest("hex").toString() +
    "?s=" +
    size +
    "&d=" +
    defaults
  );
};

module.exports = mongoose.model("User", userSchema);
