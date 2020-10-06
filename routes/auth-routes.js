const router = require("express").Router();
const passport = require("passport");
//auth login
router.get("/login", (req, res) => {
  res.render("login",{user:req.user});
});

//auth logout
router.get("/logout", (req, res) => {
  //hanlde with passport'
  req.logout();
  res.redirect("/");
});

//auth with google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile"],
  })
);

//call back to route for google to redirect to
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  res.redirect("/profile/");
});
module.exports = router;
