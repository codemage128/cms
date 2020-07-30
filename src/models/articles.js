import mongoose from "mongoose";
const Schema = mongoose.Schema;

const articleSchema = new Schema(
  {
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    title: String,
    body: String,
    file: String,
    slug: String,
    views: Number,
    dateViewed: Array,
    viewers: Array,
    tags: Array,
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category"
    },
    subCategory: {
      type: Schema.Types.ObjectId,
      ref: "SubCategory"
    },
    active: {
      type: Boolean,
      default: false
    },
    showPostOnSlider: {
      type: Boolean,
      default: true
    },
    addToFeatured: {
      type: Boolean,
      default: false
    },
    addToBreaking: {
      type: Boolean,
      default: true
    },
    addToRecommended: {
      type: Boolean,
      default: false
    },
    showOnlyToRegisteredUsers: {
      type: Boolean,
      default: false
    },
    postType: {
      type: String,
      enum: ["video", "audio", "post"]
    },
    summary: String,
    keywords: String,
    download: {
      type: Boolean
    },
    audioFile: String,
    videoFile: String,
    videoType: String,
    week: String,
    month: String,
    year: String,
    short: String,
    upvote: {
      count: {
        type: Number,
        default: 0
      },
      users: [
        {
          type: Schema.Types.ObjectId,
          ref: "User"
        }
      ]
    },
    downvote: {
      count: {
        type: Number,
        default: 0
      },
      users: [
        {
          type: Schema.Types.ObjectId,
          ref: "User"
        }
      ]
    },
    claps: {
      type: Number,
      default: 0
    },
    editor: {
      type: String,
      enum: ["tiny-mce", "editorjs"],
      default: "tiny-mce"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Article", articleSchema);
