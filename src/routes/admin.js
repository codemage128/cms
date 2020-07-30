import express from "express";
import mongoose from "mongoose";
import auth from "../helpers/auth";
import role from "../helpers/role";
import User from "../models/users";
import Article from "../models/articles";
import Tags from "../models/tags";
import Comment from "../models/comment";
import Category from "../models/category";
import Announcement from "../models/announcement";
import Newsletter from "../models/newsletter";
import Pages from "../models/pages";
import Contact from "../models/contact";
import Settings from "../models/settings";
import Media from "../models/media";
import _mail from "../helpers/_mail";
import Menu from '../models/menu';
import install from '../helpers/install';
const router = express.Router();

router.use(async (req, res, next) => {
  res.locals.weekContact = await Contact.find();
  next();
});

router.get("/dashboard", install.redirectToLogin, auth, role('admin'), (req, res, next) => {
  res.redirect("/dashboard/index");
});

router.get("/dashboard/index", install.redirectToLogin, auth, role("admin"), async (req, res, next) => {
  let totalUsers = await User.countDocuments({roleId: 'user'});
  let pendingPost = await Article.countDocuments({ active: false });
  let totalComments = await Comment.countDocuments();
  let totalPost = await Article.countDocuments();
  let latestComment = await Comment.find()
    .sort({ createdAt: -1 })
    .limit(6);
  let latestUsers = await User.find({ roleId: { $ne: "admin" } })
    .sort({ createdAt: -1 })
    .limit(6);
  let latestContact = await Contact.find()
    .sort({ createdAt: -1 })
    .limit(6);
  let latestSubscribers = await Newsletter.find()
    .sort({ createdAt: -1 })
    .limit(6);
  res.render("./admin/index", {
    title: "Dashboard",
    totalUsers: totalUsers,
    pendingPost: pendingPost,
    totalComments: totalComments,
    totalPost: totalPost,
    latestComment: latestComment,
    latestUsers: latestUsers,
    contact: latestContact,
    latestSubscribers: latestSubscribers,
  });
});

router.get(
  "/dashboard/all-posts",
  install.redirectToLogin,
  auth,
  role("admin"),
  async (req, res, next) => {
    if (req.query.category) {
      let perPage = 10;
      let page = req.query.page || 1;
      let category = await Category.findOne({ name: req.query.category });
      let article = await Article.aggregate([
        {
          $match: {
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
      res.render("./admin/all-post", {
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
      res.render("./admin/all-post", {
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
      let count = await Article.countDocuments();
      res.render("./admin/all-post", {
        title: "Dashboard - All Posts",
        article: article,
        current: page,
        pages: Math.ceil(count / perPage),
        query: "no"
      });
    }
  }
);

router.get(
  "/dashboard/posts/add-new",
  auth,
  install.redirectToLogin,
  role("admin"),
  async (req, res, next) => {
    res.render("./admin/add-new-post", {
      title: "Dashboard - Posts - Add New Post"
    });
  }
);

router.get(
  "/dashboard/posts/add-new-audio",
  auth,
  install.redirectToLogin,
  role("admin"),
  async (req, res, next) => {
    res.render("./admin/add-new-audio", {
      title: "Dashboard - Add New Audio"
    });
  }
);

router.get(
  "/dashboard/posts/add-new-video",
  auth,
  install.redirectToLogin,
  role("admin"),
  async (req, res, next) => {
    res.render("./admin/add-new-video", {
      title: "Dashboard - Add New Video"
    });
  }
);

router.get(
  "/dashboard/all-posts/edit/:slug",
  auth,
  install.redirectToLogin,
  role("admin"),
  async (req, res, next) => {
    try {
      let article = await Article.findOne({ slug: req.params.slug }).populate(
        "category"
      );
      if (!article) res.render("404");
      switch (article.postType) {
        case "post":
          res.render("./admin/edit-post", {
            title: `Edit Post - ${article.title}`,
            article: article
          });
          break;
        case "audio":
          res.render("./admin/edit-audio", {
            title: `Edit Audio - ${article.title}`,
            article: article
          });
          break;
        case "video":
          res.render("./admin/edit-video", {
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
  "/dashboard/posts/categories",
  auth,
  install.redirectToLogin,
  role("admin"),
  async (req, res, next) => {
    try {
      let perPage = 10;
      let page = req.query.page || 1;
      let category = req.query.q
        ? await Category.find({
            parent: undefined,
            name: { $regex: req.query.q, $options: "$i" }
          })
        : await Category.find({ parent: undefined })
            .sort({ createdAt: -1 })
            .skip(perPage * page - perPage)
            .limit(perPage);
      let count = req.query.q
        ? await Category.countDocuments({
            parent: undefined,
            name: { $regex: req.query.q, $options: "$i" }
          })
        : await Category.countDocuments({ parent: undefined });
      res.render("./admin/categories", {
        title: "Categories",
        category: category,
        current: page,
        pages: Math.ceil(count / perPage)
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/dashboard/posts/categories/edit/:name",
  auth,
  install.redirectToLogin,
  role("admin"),
  async (req, res, next) => {
    try {
      let category = await Category.findOne({
        parent: undefined,
        name: req.params.name
      });
      if (!category) {
        res.render("404");
      } else {
        res.render("./admin/edit-category", {
          title: `Edit Category - ${category.name}`,
          category: category
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/dashboard/posts/tags",
  auth,
  install.redirectToLogin,
  role("admin"),
  async (req, res, next) => {
    try {
      let perPage = 10;
      let page = req.query.page || 1;
      let tags = req.query.q
        ? await Tags.find({ name: { $regex: req.query.q, $options: "$i" } })
        : await Tags.find()
            .sort({ createdAt: -1 })
            .skip(perPage * page - perPage)
            .limit(perPage);
      let count = req.query.q
        ? await Tags.countDocuments({
            name: { $regex: req.query.q, $options: "$i" }
          })
        : await Tags.countDocuments();
      res.render("./admin/tags", {
        title: "Posts - Tags",
        tags: tags,
        current: page,
        pages: Math.ceil(count / perPage)
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/dashboard/posts/tags/edit/:name",
  auth,
  install.redirectToLogin,
  role("admin"),
  async (req, res, next) => {
    try {
      let tag = await Tags.findOne({ name: req.params.name });
      if (!tag) res.render("404");
      res.render("./admin/edit-tag", {
        title: `Edit Tag - ${tag.name}`,
        tag: tag
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/dashboard/announcements",
  auth,
  install.redirectToLogin,
  role("admin"),
  async (req, res, next) => {
    try {
      let perPage = 10;
      let page = req.query.page || 1;
      let announcement = req.query.q
        ? await Announcement.find({
            title: { $regex: req.query.q, $options: "$i" }
          })
        : await Announcement.find()
            .sort({ createdAt: -1 })
            .skip(perPage * page - perPage)
            .limit(perPage);
      let count = req.query.q
        ? await Announcement.countDocuments({
            title: { $regex: req.query.q, $options: "$i" }
          })
        : await Announcement.countDocuments();
      res.render("./admin/announcement", {
        title: "Dashboard - Announcements",
        announcement: announcement,
        current: page,
        pages: Math.ceil(count / perPage)
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/dashboard/announcements/add-new",
  auth,
  install.redirectToLogin,
  role("admin"),
  (req, res, next) => {
    try {
      res.render("./admin/add-new-announcement", {
        title: "Announcements - Add New"
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/dashboard/announcements/edit/:id",
  auth,
  install.redirectToLogin,
  role("admin"),
  async (req, res, next) => {
    try {
      if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        let announcement = await Announcement.findById(req.params.id);
        res.render("./admin/edit-announcement", {
          title: `Edit Announcement - ${announcement.title}`,
          announcement: announcement
        });
      } else {
        res.render("404");
      }
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/dashboard/newsletter",
  auth,
  install.redirectToLogin,
  role("admin"),
  async (req, res, next) => {
    try {
      let perPage = 10;
      let page = req.query.page || 1;
      if (req.query.q) {
        let newsletter = await Newsletter.find({
          $or: [
            { firstname: { $regex: req.query.q, $options: "i" } },
            { lastname: { $regex: req.query.q, $options: "i" } },
            { email: { $regex: req.query.q, $options: "i" } }
          ]
        })
          .skip(perPage * page - perPage)
          .limit(perPage);
        let count = await Newsletter.countDocuments({
          $or: [
            { firstname: { $regex: req.query.q, $options: "i" } },
            { lastname: { $regex: req.query.q, $options: "i" } },
            { email: { $regex: req.query.q, $options: "i" } }
          ]
        });
        res.render("./admin/newsletter", {
          title: "Dashboard - Newsletter Subscribers",
          newsletter: newsletter,
          current: page,
          pages: Math.ceil(count / perPage),
          query: true,
          search: req.query.q
        });
      } else {
        let newsletter = await Newsletter.find()
          .sort({ createdAt: -1 })
          .skip(perPage * page - perPage)
          .limit(perPage);
        let count = await Newsletter.countDocuments();
        res.render("./admin/newsletter", {
          title: "Dashboard - Newsletter Subscribers",
          newsletter: newsletter,
          current: page,
          pages: Math.ceil(count / perPage),
          query: false
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/dashboard/newsletter/edit/:email",
  auth,
  install.redirectToLogin,
  role("admin"),
  async (req, res, next) => {
    try {
      let newsletter = await Newsletter.findOne({ email: req.params.email });
      if (!newsletter) res.render("404");
      else {
        res.render("./admin/edit-newsletter", {
          title: `Update Newsletter - ${newsletter.email}`,
          newsletter: newsletter
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/dashboard/newsletter/compose",
  auth,
  install.redirectToLogin,
  role("admin"),
  async (req, res, next) => {
    try {
      let media = await Media.find().sort({ createdAt: -1 });
      res.render("./admin/compose-newsletter", {
        title: "Newsletter - Compose",
        media: media
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get("/dashboard/pages", auth, install.redirectToLogin, role("admin"), async (req, res, next) => {
  try {
    let perPage = 10;
    let page = req.query.page || 1;
    let query = req.query.q ? true : false;
    let search = req.query.q ? req.query.q : undefined;
    let pages = req.query.q
      ? await Pages.find({
          name: { $regex: req.query.q, $options: "i" }
        }).populate("author")
      : await Pages.find()
          .populate("author")
          .sort({ createdAt: -1 })
          .skip(perPage * page - perPage)
          .limit(perPage);
    let count = req.query.q
      ? await Pages.countDocuments({
          name: { $regex: req.query.q, $options: "i" }
        })
      : await Pages.countDocuments();
    res.render("./admin/pages", {
      title: "Dashboard - Pages",
      allpages: pages,
      current: page,
      pages: Math.ceil(count / perPage),
      query: query,
      search: search
    });
  } catch (error) {
    next(error);
  }
});

router.get(
  "/dashboard/pages/add-new",
  auth,
  install.redirectToLogin,
  role("admin"),
  (req, res, next) => {
    try {
      res.render("./admin/add-new-page", {
        title: "Pages - Add new Page"
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/dashboard/pages/edit/:name",
  auth,
  install.redirectToLogin,
  role("admin"),
  async (req, res, next) => {
    try {
      let page = await Pages.findOne({ name: req.params.name });
      if (!page) res.render("404");
      else {
        res.render("./admin/edit-page", {
          title: `Edit Page - ${page.name}`,
          page: page
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/dashboard/comments",
  auth,
  install.redirectToLogin,
  role("admin"),
  async (req, res, next) => {
    try {
      let perPage = 10;
      let page = req.query.page || 1;
      if (req.query.q) {
        let comment = await Comment.aggregate([
          {
            $lookup: {
              from: "articles",
              localField: "slug",
              foreignField: "slug",
              as: "articleInfo"
            }
          },
          {
            $unwind: {
              path: "$articleInfo",
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $match: {
              $or: [
                { name: { $regex: req.query.q, $options: "$i" } },
                { email: { $regex: req.query.q, $options: "$i" } },
                { comment: { $regex: req.query.q, $options: "$i" } },
                { "articleInfo.title": { $regex: req.query.q, $options: "$i" } }
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
              from: "articles",
              localField: "slug",
              foreignField: "slug",
              as: "articleInfo"
            }
          },
          {
            $unwind: {
              path: "$articleInfo",
              preserveNullAndEmptyArrays: true
            }
          }
        ]);
        let coun = await Comment.aggregate([
          {
            $lookup: {
              from: "articles",
              localField: "slug",
              foreignField: "slug",
              as: "articleInfo"
            }
          },
          {
            $unwind: {
              path: "$articleInfo",
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $match: {
              $or: [
                { name: { $regex: req.query.q, $options: "$i" } },
                { email: { $regex: req.query.q, $options: "$i" } },
                { comment: { $regex: req.query.q, $options: "$i" } },
                { "articleInfo.title": { $regex: req.query.q, $options: "$i" } }
              ]
            }
          },
          {
            $sort: {
              createdAt: -1
            }
          },
          {
            $lookup: {
              from: "articles",
              localField: "slug",
              foreignField: "slug",
              as: "articleInfo"
            }
          },
          {
            $unwind: {
              path: "$articleInfo",
              preserveNullAndEmptyArrays: true
            }
          }
        ]);
        let count = coun.length;
        res.render("./admin/comments", {
          title: "Dashboard - Comments",
          comment: comment,
          current: page,
          pages: Math.ceil(count / perPage),
          query: true,
          search: req.query.q
        });
      } else {
        let count = await Comment.countDocuments();
        let comment = await Comment.aggregate([
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
              from: "articles",
              localField: "slug",
              foreignField: "slug",
              as: "articleInfo"
            }
          },
          {
            $unwind: {
              path: "$articleInfo",
              preserveNullAndEmptyArrays: true
            }
          }
        ]);
        res.render("./admin/comments", {
          title: "Dashboard - Comments",
          comment: comment,
          current: page,
          pages: Math.ceil(count / perPage),
          query: false
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/dashboard/comments/edit/:id",
  auth,
  install.redirectToLogin,
  role("admin"),
  async (req, res, next) => {
    try {
      let comment = await Comment.findOne({ _id: req.params.id });
      if (!comment) res.render("404");
      else {
        res.render("./admin/edit-comment", {
          title: `Edit Comment - ${comment.email}`,
          comment: comment
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/dashboard/contacts",
  auth,
  install.redirectToLogin,
  role("admin"),
  async (req, res, next) => {
    try {
      let perPage = 10;
      let page = req.query.page || 1;
      let query = req.query.q ? true : false;
      let search = req.query.q ? req.query.q : undefined;
      let contact = req.query.q
        ? await Contact.find({
            $or: [
              { fullname: { $regex: req.query.q, $options: "$i" } },
              { email: { $regex: req.query.q, $options: "$i" } },
              { message: { $regex: req.query.q, $options: "$i" } }
            ]
          })
            .skip(perPage * page - perPage)
            .limit(perPage)
        : await Contact.find()
            .sort({ createdAt: -1 })
            .skip(perPage * page - perPage)
            .limit(perPage);
      let count = req.query.q
        ? await Contact.countDocuments({
            $or: [
              { fullname: { $regex: req.query.q, $options: "$i" } },
              { email: { $regex: req.query.q, $options: "$i" } },
              { message: { $regex: req.query.q, $options: "$i" } }
            ]
          })
        : await Contact.countDocuments();
      res.render("./admin/contact", {
        title: "Dashboard - Contacts",
        contact: contact,
        current: page,
        pages: Math.ceil(count / perPage),
        query: query,
        search: search
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/dashboard/contacts/view/:id",
  auth,
  install.redirectToLogin,
  role("admin"),
  async (req, res, next) => {
    try {
      if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        let contact = await Contact.findById(req.params.id);
        res.render("./admin/view-contact", {
          title: "Contact - View Full Message",
          contact: contact
        });
      } else {
        res.render("404");
      }
    } catch (error) {
      next(error);
    }
  }
);

router.get("/dashboard/users", auth, install.redirectToLogin, role("admin"), async (req, res, next) => {
  try {
    let perPage = 10;
    let page = req.query.page || 1;
    let users = req.query.q
      ? await User.find({
          roleId: {
            $ne: "admin"
          },
          $or: [
            { username: { $regex: req.query.q, $options: "i" } },
            { email: { $regex: req.query.q, $options: "i" } }
          ]
        })
          .skip(perPage * page - perPage)
          .limit(perPage)
      : await User.find({ roleId: { $ne: "admin" } })
          .sort({ createdAt: -1 })
          .skip(perPage * page - perPage)
          .limit(perPage);
    let count = req.query.q
      ? await User.countDocuments({
          roleId: {
            $ne: "admin"
          },
          $or: [
            { username: { $regex: req.query.q, $options: "i" } },
            { email: { $regex: req.query.q, $options: "i" } }
          ]
        })
      : await User.countDocuments({ roleId: { $ne: "admin" } });
    res.render("./admin/users", {
      title: "Dashboard - Users",
      allusers: users,
      current: page,
      pages: Math.ceil(count / perPage)
    });
  } catch (error) {
    next(error);
  }
});

router.get(
  "/dashboard/administrators",
  auth,
  install.redirectToLogin,
  role("admin"),
  async (req, res, next) => {
    try {
      let perPage = 10;
      let page = req.query.page || 1;
      let users = req.query.q
        ? await User.find({
            roleId: "admin",
            $or: [
              { username: { $regex: req.query.q, $options: "i" } },
              { email: { $regex: req.query.q, $options: "i" } }
            ]
          })
            .skip(perPage * page - perPage)
            .limit(perPage)
        : await User.find({ roleId: "admin" })
            .sort({ createdAt: -1 })
            .skip(perPage * page - perPage)
            .limit(perPage);
      let count = req.query.q
        ? await User.countDocuments({
            roleId: "admin",
            $or: [
              { username: { $regex: req.query.q, $options: "i" } },
              { email: { $regex: req.query.q, $options: "i" } }
            ]
          })
        : await User.countDocuments({ roleId: "admin" });
      res.render("./admin/admin", {
        title: "Dashboard - Administrators",
        allusers: users,
        current: page,
        pages: Math.ceil(count / perPage)
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/dashboard/users/edit/:username",
  auth,
  install.redirectToLogin,
  role("admin"),
  async (req, res, next) => {
    try {
      let userInfo = await User.findOne({ username: req.params.username });
      if (!userInfo) res.render("404");
      else {
        res.render("./admin/edit-users", {
          title: `Edit User - ${userInfo.username}`,
          userInfo: userInfo
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/dashboard/users/add-new",
  auth,
  install.redirectToLogin,
  role("admin"),
  async (req, res, next) => {
    try {
      res.render("./admin/add-new-user", {
        title: "Users - Add New"
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get("/profile", auth, install.redirectToLogin, role("admin"), async (req, res, next) => {
  try {
    res.render("./admin/profile", {
      title: "My Profile"
    });
  } catch (error) {
    next(error);
  }
});

router.get(
  "/dashboard/settings/general",
  auth,
  install.redirectToLogin,
  role("admin"),
  async (req, res, next) => {
    try {
      let settings = await Settings.findOne();
      res.render("./admin/general-settings", {
        title: "General Settings",
        settings: settings
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/dashboard/settings/email",
  auth,
  install.redirectToLogin,
  role("admin"),
  async (req, res, next) => {
    try {
      let settings = await Settings.findOne();
      res.render("./admin/email-settings", {
        title: "Email Settings",
        settings: settings
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/dashboard/settings/media",
  auth,
  install.redirectToLogin,
  role("admin"),
  async (req, res, next) => {
    try {
      let settings = await Settings.findOne();
      res.render("./admin/media-settings", {
        title: "Media Settings",
        settings: settings
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/dashboard/ad-spaces",
  auth,
  install.redirectToLogin,
  role("admin"),
  async (req, res, next) => {
    try {
      res.render("./admin/ad-spaces", {
        title: "Advert Spaces",
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/dashboard/library",
  auth,
  install.redirectToLogin,
  role("admin"),
  async (req, res, next) => {
    try {
      let perPage = 48;
      let page = req.query.page || 1;
      let media = await Media.find({
        file_type: { $regex: "image", $options: "$i" }
      })
        .sort({ createdAt: -1 })
        .skip(perPage * page - perPage)
        .limit(perPage);
      let count = await Media.countDocuments({
        file_type: { $regex: "image", $options: "$i" }
      });
      res.render("./admin/media", {
        title: "Dashboard Media",
        media: media,
        current: page,
        pages: Math.ceil(count / perPage)
      });
    } catch (e) {
      next(e);
    }
  }
);

router.get(
  "/dashboard/media/add-new",
  auth,
  install.redirectToLogin,
  role("admin"),
  (req, res, next) => {
    try {
      res.render("./admin/add-new-media", {
        title: "Media - Add new Media"
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/dashboard/social-login",
  auth,
  install.redirectToLogin,
  role("admin"),
  async (req, res, next) => {
    try {
      let settings = await Settings.findOne();
      res.render("./admin/social-login", {
        title: "Social Login Configuration",
        settings: settings
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/dashboard/preferences",
  auth,
  install.redirectToLogin,
  role("admin"),
  async (req, res, next) => {
    try {
      let settings = await Settings.findOne();
      res.render("./admin/preferences", {
        title: "Preferences",
        settings: settings
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/dashboard/posts/sub-categories",
  auth,
  install.redirectToLogin,
  role("admin"),
  async (req, res, next) => {
    try {
      let perPage = 10;
      let page = req.query.page || 1;
      let category = req.query.q
        ? await Category.aggregate([
            {
              $match: {
                name: { $regex: req.query.q, $options: "$i" },
                parent: {
                  $exists: {
                    $ne: false
                  }
                }
              }
            },
            {
              $lookup: {
                from: "categories",
                localField: "parent",
                foreignField: "_id",
                as: "parent"
              }
            },
            {
              $unwind: {
                path: "$parent",
                preserveNullAndEmptyArrays: true
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
            }
          ])
        : await Category.aggregate([
            {
              $match: {
                parent: {
                  $exists: {
                    $ne: false
                  }
                }
              }
            },
            {
              $lookup: {
                from: "categories",
                localField: "parent",
                foreignField: "_id",
                as: "parent"
              }
            },
            {
              $unwind: {
                path: "$parent",
                preserveNullAndEmptyArrays: true
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
            }
          ]);
      let count2 = await Category.aggregate([
        {
          $match: {
            parent: {
              $exists: {
                $ne: false
              }
            }
          }
        },
        {
          $lookup: {
            from: "categories",
            localField: "parent",
            foreignField: "_id",
            as: "parent"
          }
        },
        {
          $unwind: {
            path: "$parent",
            preserveNullAndEmptyArrays: true
          }
        }
      ]);
      let count = req.query.q
        ? await Category.aggregate([
            {
              $match: {
                name: {
                  $regex: req.query.q,
                  $options: "$i"
                },
                parent: {
                  $exists: {
                    $ne: false
                  }
                }
              }
            }
          ])
        : count2.length;
      res.render("./admin/subcategory", {
        title: "Categories - Sub Categories",
        category: category,
        current: page,
        pages: Math.ceil(count.length / perPage)
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/dashboard/posts/subcategory/edit/:name",
  auth,
  install.redirectToLogin,
  role("admin"),
  async (req, res, next) => {
    try {
      let category = await Category.findOne({
        parent: { $ne: undefined },
        name: req.params.name
      }).populate("parent");
      if (!category) {
        res.render("404");
      } else {
        res.render("./admin/edit-subcategory", {
          title: `Edit Subcategory - ${category.name}`,
          category: category
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

router.get('/dashboard/visual', auth, install.redirectToLogin, role('admin'), async (req, res, next) => {
  res.render('./admin/visual', {
    title: 'Visual Settings'
  });
});

router.get('/dashboard/menu', auth, install.redirectToLogin, role('admin'), async (req, res, next) => {
  let menu = await Menu.find().sort({position: 1});
  let adminCat = await Category.find().sort({createdAt: -1});
  let adminPage = await Pages.find().sort({createdAt: -1});
  let adminTag = await Tags.find().sort({createdAt: -1});
  let adminAuthor = await User.find().sort({createdAt: -1});
  res.render('./admin/menu', {
    title: 'Menu',
    menu,
    adminCat,
    adminPage,
    adminTag,
    adminAuthor,
  });
});

module.exports = router;
