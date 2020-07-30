import express from "express";
import Article from "../models/articles";
import auth from "../helpers/auth";
import role from "../helpers/role";
import mongoose from "mongoose";
import Category from "../models/category";
import User from "../models/users";
import Bookmark from "../models/bookmark";
const router = express.Router();

router.get(
  "/user/dashboard",
  auth,
  role("admin", "user"),
  async (req, res, next) => {
    try {
      let totalPost = await Article.countDocuments({ postedBy: req.user.id });
      let pendingPost = await Article.countDocuments({
        postedBy: req.user.id,
        active: false
      });
      res.render("./user/index", {
        title: "Dashboard",
        totalPost: totalPost,
        pendingPost: pendingPost
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/user/posts/add-new",
  auth,
  role("admin", "user"),
  async (req, res, next) => {
    try {
      res.render("./user/add-new-post", {
        title: "Article - Add new post"
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/user/posts/add-new-audio",
  auth,
  role("admin", "user"),
  async (req, res, next) => {
    res.render("./user/add-new-audio", {
      title: "Audio - Add new Audio"
    });
  }
);

router.get(
  "/user/posts/add-new-video",
  auth,
  role("admin", "user"),
  async (req, res, next) => {
    res.render("./user/add-new-video", {
      title: "Video - Add new Video"
    });
  }
);

router.get(
  "/user/all-posts",
  auth,
  role("admin", "user"),
  async (req, res, next) => {
    if (req.query.category) {
      let perPage = 10;
      let page = req.query.page || 1;
      let category = await Category.findOne({ name: req.query.category });
      let article = await Article.aggregate([
        {
          $match: {
            postedBy: mongoose.Types.ObjectId(req.user.id),
            $or: [
              { category: mongoose.Types.ObjectId(category._id) },
              { subCategory: mongoose.Types.ObjectId(category._id) }
            ]
          }
        },
        {
          $sort: {
            createdAt: -1
          }
        },
        {
          $skip: perPage * page - perPage
        },
        {
          $limit: perPage
        },
        {
          $lookup: {
            from: "comments",
            localField: "slug",
            foreignField: "slug",
            as: "comments"
          }
        },
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "category"
          }
        },
        {
          $unwind: {
            path: "$category",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "postedBy",
            foreignField: "_id",
            as: "postedBy"
          }
        },
        {
          $unwind: {
            path: "$postedBy",
            preserveNullAndEmptyArrays: true
          }
        }
      ]);
      let coun = await Article.aggregate([
        {
          $match: {
            postedBy: mongoose.Types.ObjectId(req.user.id),
            category: mongoose.Types.ObjectId(category._id)
          }
        },
        {
          $sort: {
            createdAt: -1
          }
        },
        {
          $lookup: {
            from: "comments",
            localField: "slug",
            foreignField: "slug",
            as: "comments"
          }
        },
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "category"
          }
        },
        {
          $unwind: {
            path: "$category",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "postedBy",
            foreignField: "_id",
            as: "postedBy"
          }
        },
        {
          $unwind: {
            path: "$postedBy",
            preserveNullAndEmptyArrays: true
          }
        }
      ]);
      let count = coun.length;
      res.render("./user/all-post", {
        title: "Dashboard - All Posts",
        article: article,
        current: page,
        pages: Math.ceil(count / perPage),
        query: "yes",
        searchName: req.query.category
      });
    } else if (req.query.q) {
      let perPage = 10;
      let page = req.query.page || 1;
      let article = await Article.aggregate([
        {
          $match: {
            postedBy: mongoose.Types.ObjectId(req.user.id),
            title: { $regex: req.query.q, $options: "$i" }
          }
        },
        {
          $sort: {
            createdAt: -1
          }
        },
        {
          $skip: perPage * page - perPage
        },
        {
          $limit: perPage
        },
        {
          $lookup: {
            from: "comments",
            localField: "slug",
            foreignField: "slug",
            as: "comments"
          }
        },
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "category"
          }
        },
        {
          $unwind: {
            path: "$category",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "postedBy",
            foreignField: "_id",
            as: "postedBy"
          }
        },
        {
          $unwind: {
            path: "$postedBy",
            preserveNullAndEmptyArrays: true
          }
        }
      ]);
      let coun = await Article.aggregate([
        {
          $match: {
            postedBy: mongoose.Types.ObjectId(req.user.id),
            title: { $regex: req.query.q, $options: "$i" }
          }
        },
        {
          $sort: {
            createdAt: -1
          }
        },
        {
          $lookup: {
            from: "comments",
            localField: "slug",
            foreignField: "slug",
            as: "comments"
          }
        },
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "category"
          }
        },
        {
          $unwind: {
            path: "$category",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "postedBy",
            foreignField: "_id",
            as: "postedBy"
          }
        },
        {
          $unwind: {
            path: "$postedBy",
            preserveNullAndEmptyArrays: true
          }
        }
      ]);
      let count = coun.length;
      res.render("./user/all-post", {
        title: "Dashboard - All Posts",
        article: article,
        current: page,
        pages: Math.ceil(count / perPage),
        query: true,
        searchName: req.query.q
      });
    } else {
      let perPage = 10;
      let page = req.query.page || 1;
      let article = await Article.aggregate([
        {
          $match: {
            postedBy: mongoose.Types.ObjectId(req.user.id)
          }
        },
        {
          $sort: {
            createdAt: -1
          }
        },
        {
          $skip: perPage * page - perPage
        },
        {
          $limit: perPage
        },
        {
          $lookup: {
            from: "comments",
            localField: "slug",
            foreignField: "slug",
            as: "comments"
          }
        }, // Am not preserving comments because i need it to be an array to be able to get the length
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "category"
          }
        },
        {
          $unwind: {
            path: "$category",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "postedBy",
            foreignField: "_id",
            as: "postedBy"
          }
        },
        {
          $unwind: {
            path: "$postedBy",
            preserveNullAndEmptyArrays: true
          }
        }
      ]);
      let count = await Article.countDocuments({ postedBy: req.user.id });
      res.render("./user/all-post", {
        title: "All Posts",
        article: article,
        current: page,
        pages: Math.ceil(count / perPage),
        query: "no"
      });
    }
  }
);

router.get(
  "/user/all-posts/edit/:slug",
  auth,
  role("admin", "user"),
  async (req, res, next) => {
    try {
      let article = await Article.findOne({
        postedBy: req.user.id,
        slug: req.params.slug
      }).populate("category");
      if (!article) res.render("404");
      switch (article.postType) {
        case "post":
          res.render("./user/edit-post", {
            title: `Edit Post - ${article.title}`,
            article: article
          });
          break;
        case "audio":
          res.render("./user/edit-audio", {
            title: `Edit Audio - ${article.title}`,
            article: article
          });
          break;
        case "video":
          res.render("./user/edit-video", {
            title: `Edit Video - ${article.title}`,
            article: article
          });
          break;
        default:
          break;
      }
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/user/pending-posts",
  auth,
  role("admin", "user"),
  async (req, res, next) => {
    if (req.query.category) {
      let perPage = 10;
      let page = req.query.page || 1;
      let category = await Category.findOne({ name: req.query.category });
      let article = await Article.aggregate([
        {
          $match: {
            active: false,
            postedBy: mongoose.Types.ObjectId(req.user.id),
            $or: [
              { category: mongoose.Types.ObjectId(category._id) },
              { subCategory: mongoose.Types.ObjectId(category._id) }
            ]
          }
        },
        {
          $sort: {
            createdAt: -1
          }
        },
        {
          $skip: perPage * page - perPage
        },
        {
          $limit: perPage
        },
        {
          $lookup: {
            from: "comments",
            localField: "slug",
            foreignField: "slug",
            as: "comments"
          }
        },
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "category"
          }
        },
        {
          $unwind: {
            path: "$category",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "postedBy",
            foreignField: "_id",
            as: "postedBy"
          }
        },
        {
          $unwind: {
            path: "$postedBy",
            preserveNullAndEmptyArrays: true
          }
        }
      ]);
      let coun = await Article.aggregate([
        {
          $match: {
            active: false,
            postedBy: mongoose.Types.ObjectId(req.user.id),
            category: mongoose.Types.ObjectId(category._id)
          }
        },
        {
          $sort: {
            createdAt: -1
          }
        },
        {
          $lookup: {
            from: "comments",
            localField: "slug",
            foreignField: "slug",
            as: "comments"
          }
        },
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "category"
          }
        },
        {
          $unwind: {
            path: "$category",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "postedBy",
            foreignField: "_id",
            as: "postedBy"
          }
        },
        {
          $unwind: {
            path: "$postedBy",
            preserveNullAndEmptyArrays: true
          }
        }
      ]);
      let count = coun.length;
      res.render("./user/pending-post", {
        title: "Pending Posts",
        article: article,
        current: page,
        pages: Math.ceil(count / perPage),
        query: "yes",
        searchName: req.query.category
      });
    } else if (req.query.q) {
      let perPage = 10;
      let page = req.query.page || 1;
      let article = await Article.aggregate([
        {
          $match: {
            active: false,
            postedBy: mongoose.Types.ObjectId(req.user.id),
            title: { $regex: req.query.q, $options: "$i" }
          }
        },
        {
          $sort: {
            createdAt: -1
          }
        },
        {
          $skip: perPage * page - perPage
        },
        {
          $limit: perPage
        },
        {
          $lookup: {
            from: "comments",
            localField: "slug",
            foreignField: "slug",
            as: "comments"
          }
        },
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "category"
          }
        },
        {
          $unwind: {
            path: "$category",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "postedBy",
            foreignField: "_id",
            as: "postedBy"
          }
        },
        {
          $unwind: {
            path: "$postedBy",
            preserveNullAndEmptyArrays: true
          }
        }
      ]);
      let coun = await Article.aggregate([
        {
          $match: {
            active: false,
            postedBy: mongoose.Types.ObjectId(req.user.id),
            title: { $regex: req.query.q, $options: "$i" }
          }
        },
        {
          $sort: {
            createdAt: -1
          }
        },
        {
          $lookup: {
            from: "comments",
            localField: "slug",
            foreignField: "slug",
            as: "comments"
          }
        },
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "category"
          }
        },
        {
          $unwind: {
            path: "$category",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "postedBy",
            foreignField: "_id",
            as: "postedBy"
          }
        },
        {
          $unwind: {
            path: "$postedBy",
            preserveNullAndEmptyArrays: true
          }
        }
      ]);
      let count = coun.length;
      res.render("./user/pending-post", {
        title: "Pending Posts",
        article: article,
        current: page,
        pages: Math.ceil(count / perPage),
        query: true,
        searchName: req.query.q
      });
    } else {
      let perPage = 10;
      let page = req.query.page || 1;
      let article = await Article.aggregate([
        {
          $match: {
            active: false,
            postedBy: mongoose.Types.ObjectId(req.user.id)
          }
        },
        {
          $sort: {
            createdAt: -1
          }
        },
        {
          $skip: perPage * page - perPage
        },
        {
          $limit: perPage
        },
        {
          $lookup: {
            from: "comments",
            localField: "slug",
            foreignField: "slug",
            as: "comments"
          }
        }, // Am not preserving comments because i need it to be an array to be able to get the length
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "category"
          }
        },
        {
          $unwind: {
            path: "$category",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "postedBy",
            foreignField: "_id",
            as: "postedBy"
          }
        },
        {
          $unwind: {
            path: "$postedBy",
            preserveNullAndEmptyArrays: true
          }
        }
      ]);
      let count = await Article.countDocuments({
        active: false,
        postedBy: req.user.id
      });
      res.render("./user/pending-post", {
        title: "Pending Posts",
        article: article,
        current: page,
        pages: Math.ceil(count / perPage),
        query: "no"
      });
    }
  }
);

router.get("/user/profile", auth, role("admin", "user"), (req, res, next) => {
  res.render("./user/profile", {
    title: "My Profile"
  });
});

router.get(
  "/user/followers",
  auth,
  role("admin", "user"),
  async (req, res, next) => {
    const followers = await User.find({
      following: { $in: req.user.id }
    }).populate("following").sort({createdAt: -1});
    res.render("./user/followers", { title: "My Followers", followers });
  }
);

router.get(
  "/user/following",
  auth,
  role("admin", "user"),
  async (req, res, next) => {
    const following = await User.findById(req.user.id).populate("following").sort({createdAt: -1});
    res.render("./user/following", { title: "Following", following });
  }
);

router.get(
  "/user/bookmarks",
  auth,
  role("admin", "user"),
  async (req, res, next) => {
    const bookmark = await Bookmark.find({ userId: req.user.id }).populate({
      path: "articleId",
      populate: { path: "postedBy category" }
    }).sort({createdAt: -1});
    res.render("./user/bookmark", { title: "Reading List", bookmark });
  }
);

module.exports = router;
