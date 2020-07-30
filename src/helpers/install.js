import User from "../models/users";
import Settings from "../models/settings";
import In from "../models/in";
let install = {};

install.checkStatus = async (req, res, next) => {
  let active = await In.findOne({ yes: true });
  if (!active) return res.redirect("/install");
  //return res.send(`You havent verified your purchase code, go back to ${req.headers.host}/install to verify your purchase code`);
  else next();
};

install.redirectToLogin = async (req, res, next) => {
  let settings = await Settings.findOne();
  let user = await User.findOne({ roleId: "admin" });
  if (!settings) {
    return res.redirect("/install");
  } else if (!user) {
    return res.redirect("/install/admin");
  } else {
    next();
  }
};

(install.redirectToAdmin = install.checkStatus),
  async (req, res, next) => {
    let user = await User.findOne({ roleId: "admin" });
    if (user) res.render("404");
    else next();
  };

(install.disableInstallPage = install.checkStatus),
  async (req, res, next) => {
    let set = await Settings.findOne();
    let user = await User.findOne({ roleId: "admin" });
    let yes = await In.findOne({ yes: true });
    if (set && user) res.render("404");
    else if (set && !user) {
      if (yes) {
        res.redirect("/install/admin");
      } else {
        res.render("install");
      }
    } else next();
  };

install.redirect = async (req, res, next) => {
  let set = await Settings.findOne();
  let user = await User.findOne({ roleId: "admin" });
  let yes = await In.findOne({ yes: true });
  if (set && user) res.render("404");
  else if (set && !user) {
    if (yes) {
      res.redirect("/install/admin");
    } else res.render("install");
  } else next();
};

export default install;
