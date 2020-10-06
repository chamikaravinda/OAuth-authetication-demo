const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const keys = require("./keys");
const User = require("../models/user-model");

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((sessionUser, done) => {
  done(null, sessionUser); // now can access request.user
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret,
      callbackURL: "/auth/google/redirect",
      passReqToCallback: true,
    },
    (request, accessToken, refreshToken, profile, done) => {
      //passport call back function
      User.findOne({ googleID: profile.id }).then((currentUser) => {
        if (currentUser) {
          //already have a user
          done(null, currentUser);
        } else {
          //create a user in a db
          new User({
            username: profile.displayName,
            googleID: profile.id,
            thumbnail: profile._json.picture,
            accessToken: accessToken,
            refreshToken: refreshToken,
            email: profile._json.email,
          })

            .save()
            .then((newUser) => {
              console.log("new user created" + newUser);
              done(null, newUser);
            });
        }
      });
    }
  )
);
