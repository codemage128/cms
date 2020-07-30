import mongoose from "mongoose";
const Schema = mongoose.Schema;
const bookmarkSchema = new Schema(
  {
    articleId: {
      type: Schema.Types.ObjectId,
      ref: "Article"
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Bookmark", bookmarkSchema);
