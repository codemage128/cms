import express from "express";
import Bookmark from "../models/bookmark";
import auth from "../helpers/auth";
const router = express.Router();

// Add a new article to reading list
router.get("/bookmark/create", auth, async (req, res, next) => {
  const check = await Bookmark.findOne({
    articleId: req.query.articleId,
    userId: req.user.id
  });
  if (check) {
    req.flash("success_msg", "Article already exist in your reading list");
    return res.redirect("back");
  }

  await Bookmark.create({
    articleId: req.query.articleId,
    userId: req.user.id
  });
  req.flash("success_msg", "Article has been added to reading list");
  return res.redirect("back");
});

// Remove an article from reading list
router.get("/bookmark/delete", auth, async (req, res, next) => {
  await Bookmark.deleteOne({ _id: req.query.bookmarkId });
  req.flash("success_msg", "Article has been removed from reading list");
  return res.redirect("back");
});

export default router;
