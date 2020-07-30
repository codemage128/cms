import express from "express";
import Pages from "../models/pages";
import auth from "../helpers/auth";
const router = express.Router();

// Create a page
router.post("/pages/create", auth, async (req, res, next) => {
  try {
    req.assert("name", "Page Name Cannot be Blank").notEmpty();
    req.assert("content", "Page Content Cannot be Blank").notEmpty();
    const error = req.validationErrors();
    if (error) {
      req.flash("success_msg", `${error[0].msg}`);
      return res.redirect("back");
    } else {
      let exist = await Pages.find({ name: { $regex: req.body.name } });
      if (exist == "") {
        let payload = {
          name: req.body.name.trim(),
          content: req.body.content.trim(),
          featuredImage: req.body.featuredImage,
          status: !req.body.status ? "published" : req.body.status,
          author: req.user.id,
          slug: req.body.name
            .trim()
            .toLowerCase()
            .split(" ")
            .join("-"),
          location: !req.body.location ? "main-menu" : req.body.location,
          position: !req.body.position ? "right" : req.body.position
        };
        Pages.create(payload)
          .then(created => {
            req.flash("success_msg", "Page Created Successfully");
            return res.redirect("back");
          })
          .catch(e => next(e));
      } else {
        req.flash("success_msg", "There's a Page with That name");
        return res.redirect("back");
      }
    }
  } catch (error) {
    next(error);
  }
});

// Edit a page
router.post("/pages/edit", auth, (req, res, next) => {
  try {
    req.assert("name", "Page Name Cannot be Blank").notEmpty();
    req.assert("content", "Page Content Cannot be Blank").notEmpty();
    const error = req.validationErrors();
    if (error) {
      req.flash("success_msg", `${error[0].msg}`);
      return res.redirect("back");
    } else {
      req.body.name = req.body.name.trim();
      req.body.slug = req.body.name
        .trim()
        .toLowerCase()
        .split(" ")
        .join("-");
      Pages.updateOne({ _id: req.body.pageId }, req.body)
        .then(created => {
          req.flash("success_msg", "Page Updated Successfully");
          return res.redirect("/dashboard/pages");
        })
        .catch(e => next(e));
    }
  } catch (error) {
    next(error);
  }
});

// Delete many pages
router.post("/pages/deleteMany", auth, (req, res, next) => {
  try {
    Pages.deleteMany({ _id: req.body.ids })
      .then(deleted => {
        if (!req.body.ids) {
          req.flash("success_msg", "Nothing was Deleted");
          return res.redirect("back");
        } else {
          req.flash("success_msg", "Pages has Been Deleted");
          return res.redirect("back");
        }
      })
      .catch(e => next(e));
  } catch (error) {
    next(error);
  }
});

// Delete single page
router.post("/pages/delete", auth, (req, res, next) => {
  try {
    Pages.deleteOne({ _id: req.body.pageId })
      .then(deleted => {
        req.flash("success_msg", "Page has Been Deleted");
        return res.redirect("back");
      })
      .catch(e => next(e));
  } catch (error) {
    next(error);
  }
});

// Publish many pages
router.post("/pages/publish", auth, (req, res, next) => {
  try {
    Pages.updateMany({ _id: req.body.ids }, { $set: { status: "published" } })
      .then(done => {
        if (!req.body.ids) {
          req.flash("success_msg", "Nothing Was Updated");
          return res.redirect("back");
        } else {
          req.flash("success_msg", "Pages has been Updated");
          return res.redirect("back");
        }
      })
      .catch(e => next(e));
  } catch (error) {
    next(error);
  }
});

// Draft many pages
router.post("/pages/draft", auth, (req, res, next) => {
  try {
    Pages.updateMany({ _id: req.body.ids }, { $set: { status: "draft" } })
      .then(done => {
        if (!req.body.ids) {
          req.flash("success_msg", "Nothing Was Updated");
          return res.redirect("back");
        } else {
          req.flash("success_msg", "Pages has been Updated");
          return res.redirect("back");
        }
      })
      .catch(e => next(e));
  } catch (error) {
    next(error);
  }
});

// get a page
router.get("/pages/:slug", async (req, res, next) => {
  try {
    let page = await Pages.findOne({ slug: req.params.slug });
    if (!page) return res.render("404");
    res.render("page", {
      page
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
