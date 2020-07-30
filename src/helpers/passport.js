import passport from "passport";
import Settings from "../models/settings";
const LocalStrategy = require("passport-local").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const TwitterStrategy = require("passport-twitter").Strategy;
const VKontakteStrategy = require("passport-vkontakte").Strategy;
import User from "../models/users";

let set = new Promise((resolve, reject) => {
  let data = Settings.findOne();
  resolve(data);
});

//Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

//Deserialize user
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

//Local Strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    (email, password, done) => {
      User.findOne({ email: email }, (err, user) => {
        if (err) return done(err);
        if (!user) return done(null, false, { message: "Incorrect Username" });
        user.comparePassword(password, (err, isMatch) => {
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Incorrect password." });
          }
        });
      });
    }
  )
);

// Facebook Strategy
set.then(data => {
  passport.use(
    new FacebookStrategy(
      {
        clientID:
          data != null
            ? data.socialLogin.facebook.appId !== undefined
              ? data.socialLogin.facebook.appId
              : " "
            : " ",
        clientSecret:
          data != null
            ? data.socialLogin.facebook.appSecret != undefined
              ? data.socialLogin.facebook.appSecret
              : " "
            : " ",
        callbackURL: "/auth/facebook/callback",
        profileFields: ["id", "displayName", "photos", "email"]
      },
      function(accessToken, refreshToken, profile, done) {
        process.nextTick(() => {
          User.findOne({ email: profile.emails[0].value }, (err, user) => {
            if (err) return done(err);
            if (user) return done(null, user);
            else {
              let payload = {
                email: profile.emails[0].value,
                username: profile.displayName
                  .split(" ")
                  .join("-")
                  .toLowerCase(),
                profilePicture: `https://graph.facebook.com/${profile.id}/picture?type=large`,
                active: true,
                provider: profile.provider,
                facebookId: profile.id,
                firstName: profile.displayName.split(" ").shift(),
                lastName: profile.displayName.split(" ").pop()
              };
              let newUser = new User(payload);
              newUser.save((err, user) => {
                if (err) throw err;
                return done(null, newUser);
              });
            }
          });
        });
      }
    )
  );

  // Google strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID:
          data != null
            ? data.socialLogin.google.clientId !== undefined
              ? data.socialLogin.google.clientId
              : " "
            : " ",
        clientSecret:
          data != null
            ? data.socialLogin.google.clientSecret !== undefined
              ? data.socialLogin.google.clientSecret
              : " "
            : " ",
        callbackURL: "/auth/google/callback"
      },
      function(accessToken, refreshToken, profile, done) {
        process.nextTick(() => {
          User.findOne({ email: profile.emails[0].value }, (err, user) => {
            if (err) return done(err);
            if (user) return done(null, user);
            else {
              console.log(profile);
              let payload = {
                email: profile.emails[0].value,
                username: profile.displayName
                  .split(" ")
                  .join("-")
                  .toLowerCase(),
                profilePicture: profile.photos[0].value,
                active: true,
                provider: profile.provider,
                googleId: profile.id,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName
              };
              let newUser = new User(payload);
              newUser.save((err, user) => {
                if (err) throw err;
                return done(null, newUser);
              });
            }
          });
        });
      }
    )
  );

  // Twitter strategy
  passport.use(
    new TwitterStrategy(
      {
        consumerKey:
          data != null
            ? data.socialLogin.twitter.consumerKey !== undefined
              ? data.socialLogin.twitter.consumerKey
              : " "
            : " ",
        consumerSecret:
          data != null
            ? data.socialLogin.twitter.consumerSecret !== undefined
              ? data.socialLogin.twitter.consumerSecret
              : " "
            : " ",
        callbackURL: "/auth/twitter/callback",
        userProfileURL:
          "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true"
      },
      function(token, tokenSecret, profile, done) {
        User.findOne({ email: profile.emails[0].value }, (err, user) => {
          if (err) return done(err);
          if (user) return done(null, user);
          else {
            console.log(profile);
            let payload = {
              email: profile.emails[0].value,
              username: profile.username
                .split(" ")
                .join("-")
                .toLowerCase(),
              profilePicture: profile.photos[0].value.replace(
                /_normal\./,
                "_bigger."
              ),
              active: true,
              provider: profile.provider,
              twitterId: profile.id,
              firstName: profile.displayName,
              lastName: profile.displayName
            };
            let newUser = new User(payload);
            newUser.save((err, user) => {
              if (err) throw err;
              return done(null, newUser);
            });
          }
        });
      }
    )
  );

  // VK strategy
  passport.use(
    new VKontakteStrategy(
      {
        clientID:
          data != null
            ? data.socialLogin.vkon.clientId !== undefined
              ? data.socialLogin.vkon.clientId
              : " "
            : " ",
        clientSecret:
          data != null
            ? data.socialLogin.vkon.clientSecret !== undefined
              ? data.socialLogin.vkon.clientSecret
              : " "
            : " ",
        callbackURL: "/auth/vkontakte/callback"
      },
      function(accessToken, refreshToken, params, profile, done) {
        if (!params.email) {
          return done(null, false, { message: "Email Access Not given" });
        } else {
          User.findOne({ email: params.email }, (err, user) => {
            if (err) return done(err);
            if (user) return done(null, user);
            else {
              let payload = {
                email: params.email,
                username: profile.displayName
                  .split(" ")
                  .join("-")
                  .toLowerCase(),
                profilePicture: profile.photos[0].value.replace(
                  /_50\./,
                  "_200."
                ),
                active: true,
                provider: profile.provider,
                vkontakteId: profile.id,
                firstName: profile.displayName,
                lastName: profile.displayName
              };
              let newUser = new User(payload);
              newUser.save((err, user) => {
                if (err) throw err;
                return done(null, newUser);
              });
            }
          });
        }
      }
    )
  );
});

module.exports = passport;
