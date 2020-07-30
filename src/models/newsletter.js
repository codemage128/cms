import mongoose from "mongoose";
const Schema = mongoose.Schema;

const newsletterSchema = new Schema(
  {
    email: String,
    firstname: String,
    lastname: String,
    newsletterType: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
      default: "weekly"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Newsletter", newsletterSchema);
