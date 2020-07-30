import mongoose from "mongoose";
const Schema = mongoose.Schema;
const flagSchema = new Schema(
  {
    articleId: {
      type: Schema.Types.ObjectId,
      ref: "Article"
    },
    reason: String,
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Flag", flagSchema);
