import express from "express";
import Newsletter from "../models/newsletter";
import _mail from "../helpers/_mail";
import role from "../helpers/role";
import Article from "../models/articles";
import auth from "../helpers/auth";
import cron from "node-cron";
import moment from "moment";
const router = express.Router();

// Subscribe to newsletter
router.post("/newsletter", async (req, res, next) => {
  try {
    let exist = await Newsletter.find({ email: req.body.email });
    if (exist == "") {
      req.assert("email", "Email Field cannot be blank").notEmpty();
      req.assert("email", "Email is invalid").isEmail();
      req.assert("firstname", "First Name cannot be empty").notEmpty();
      req.assert("lastname", "Last name cannot be empty").notEmpty();
      req.sanitize("email").normalizeEmail({ gmail_remove_dots: false });
      const errors = req.validationErrors();
      if (errors) {
        req.flash("success_msg", `${errors[0].msg}`);
        return res.redirect(`back`);
      } else {
        let payload = {
          email: req.body.email.trim(),
          firstname: req.body.firstname.trim(),
          lastname: req.body.lastname.trim(),
          host: `${req.protocol}://${req.headers.host}`,
          logo: res.locals.siteLogo,
          instagram: res.locals.instagram,
          facebook: res.locals.facebook,
          twitter: res.locals.twitter,
          siteLink: res.locals.siteLink,
          newsletterType: req.body.newsletterType
            ? req.body.newsletterType
            : "weekly"
        };
        let subscribeUser = new Newsletter(payload);
        subscribeUser
          .save()
          .then(subscribed => {
            _mail(
              "Thanks for subscribing to our newsletter",
              payload.email,
              "subscription",
              payload,
              req.headers.host,
              (err, info) => {
                if (err) console.log(err);
              }
            );
            req.flash(
              "success_msg",
              "Thanks for subscribing to our newsletter"
            );
            return res.redirect("back");
          })
          .catch(e => next(e));
      }
    } else {
      req.flash(
        "success_msg",
        "Your email exist in our subscription list, Don't worry you are safe."
      );
      return res.redirect("back");
    }
  } catch (error) {
    next(error);
  }
});

// Unsubscribe from newsletter
router.get("/newsletter/unsubscribe", (req, res, next) => {
  try {
    if (!req.query.email) res.render("404");
    else {
      Newsletter.findOne({ email: req.query.email })
        .then(info => {
          let payload = {
            email: info.email,
            firstname: info.firstname,
            lastname: info.lastname,
            host: `${req.protocol}://${req.headers.host}`,
            logo: res.locals.siteLogo,
            instagram: res.locals.instagram,
            facebook: res.locals.facebook,
            twitter: res.locals.twitter,
            siteLink: res.locals.siteLink
          };
          Newsletter.deleteOne({ email: req.query.email })
            .then(deleted => {
              _mail(
                "Unsubscribed Successfully",
                req.query.email,
                "unsubscribe",
                payload,
                req.headers.host,
                (info, err) => {
                  console.log(info.response);
                }
              );
              req.flash(
                "success_msg",
                "You have unsubscribed from our newsletter, we are so sorry to see you go"
              );
              return res.redirect("/");
            })
            .catch(e => next(e));
        })
        .catch(e => next(e));
    }
  } catch (error) {
    next(error);
  }
});

// update newsletter
router.post("/newsletter/edit", auth, role("admin"), (req, res, next) => {
  try {
    Newsletter.updateOne({ _id: req.body.emailId }, req.body)
      .then(updated => {
        req.flash("success_msg", "Subscriber Info has been Updated");
        return res.redirect("back");
      })
      .catch(e => next(e));
  } catch (error) {
    next(error);
  }
});

// Delete Many
router.post("/newsletter/deleteMany", auth, role("admin"), (req, res, next) => {
  try {
    Newsletter.deleteMany({ _id: req.body.ids })
      .then(deleted => {
        if (!req.body.ids) {
          req.flash("success_msg", "Nothing Was Deleted");
          return res.redirect("back");
        } else {
          req.flash("success_msg", "Subscriber Deleted successfully");
          return res.redirect("back");
        }
      })
      .catch(e => next(e));
  } catch (error) {
    next(error);
  }
});

// Send email to subscribers
router.post(
  "/newsletter/compose",
  auth,
  role("admin"),
  async (req, res, next) => {
    let users = await Newsletter.find();
    let payload = {
      message: req.body.message,
      subject: req.body.subject,
      logo: res.locals.siteLogo,
      instagram: res.locals.instagram,
      facebook: res.locals.facebook,
      twitter: res.locals.twitter,
      username: req.user.username,
      role: req.user.roleId,
      at: res.locals.siteTitle,
      profilePicture: req.user.profilePicture,
      siteLink: res.locals.siteLink
    };
    users.map(user => {
      _mail(
        req.body.subject,
        user.email,
        "general-email",
        payload,
        req.headers.host,
        (err, info) => {
          if (err) console.log(err);
        }
      );
    });
    req.flash("success_msg", "Email Sent Successfully");
    return res.redirect("back");
  }
);

// Switch newsletter type e.g daily to weekly or monthly
router.post("/newsletter/switch", async (req, res, next) => {
  await Newsletter.updateOne(
    { email: req.body.email },
    { newsletterType: req.body.newsletterType }
  );
  req.flash("success_msg", "Newsletter Status has been updated successfully");
  return res.redirect("back");
});

// Send weekly newsletter
async function sendWeeklyEmails() {
  try {
    await Newsletter.find({})
      .then(info => {
        Array.prototype.forEach.call(info, async inf => {
          await Article.find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .then(article => {
              let payload = {
                email: inf.email,
                firstname: inf.firstname,
                lastname: inf.lastname
              };
              _mail(
                "Weekly Newsletter",
                inf.email,
                "newsletter",
                payload,
                req.headers.host,
                (err, info) => {
                  console.log(info.response);
                }
              );
            })
            .catch(e => console.log(e));
        });
      })
      .catch(e => console.log(e));
  } catch (error) {
    console.log(error);
  }
}

// Let cron job send the newsletter 7 of every saturday morning
cron.schedule("0 7 * * Saturday", function() {
  sendWeeklyEmails();
});

// function to send daily digest to daily newsletter subscribers
async function sendDailyEmails() {
  let end_of_day = moment()
    .endOf("day")
    .toString();
  let convert_to_string = date => new Date(date).toLocaleDateString();
}

sendDailyEmails();

module.exports = router;
