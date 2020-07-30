import express from "express";
import Menu from "../models/menu";
import auth from "../helpers/auth";
import role from "../helpers/role";
const router = express.Router();

// Create a new menu
router.post("/menu/create", auth, role("admin"), async (req, res, next) => {
  let menu = await Menu.countDocuments();
  req.assert("name", "Menu name field cannot be blank").notEmpty();
  req.assert("type", "Pls choose a menu type").notEmpty();
  const error = req.validationErrors();
  if (error) {
    req.flash("success_msg", error[0].msg);
    return res.redirect("back");
  }
  req.body.position = menu + 1;
  await Menu.create(req.body);
  req.flash("success_msg", "Menu created Successfully");
  return res.redirect("back");
});

// edit a menu
router.post("/menu/edit", auth, role("admin"), async (req, res, next) => {
  let menu = await Menu.find({ _id: req.body.menuId });
  menu.map(async _menu => {
    let payload = {
      position: req.body[`item[${_menu._id}][position]`],
      link: req.body[`item[${_menu._id}][link]`],
      type: req.body[`item[${_menu._id}][type]`],
      name: req.body[`item[${_menu._id}][name]`]
    };
    await Menu.updateOne({ _id: _menu._id }, payload);
  });
  req.flash("success_msg", "Menu updated successfully");
  return res.redirect("back");
});

// Delete a menu
router.post("/menu/delete", auth, role("admin"), async (req, res, next) => {
  await Menu.deleteOne({ _id: req.body.id });
  res.status(200).send("Menu has been deleted.");
});

module.exports = router;
