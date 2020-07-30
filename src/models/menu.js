import mongoose from "mongoose";
const Schema = mongoose.Schema;
const menuSchema = new Schema(
  {
    name: String,
    type: String,
    link: String,
    position: Number,
  },
  { timestamps: true }
);
module.exports = mongoose.model("Menu", menuSchema);
