const router = require("express").Router();
const passport = require("passport");
//auth login
router.get("/login", (req, res) => {
  res.render("login");
});

//auth logout
router.get("/logout", (req, res) => {
  //hanlde with passport'
  res.send("login out");
});

//auth with google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile"],
  })
);

//call back to route for google to redirect to
router.get("/google/redirect", (req, res) => {
  res.send("You reached the callback URI");
});
module.exports = router;
