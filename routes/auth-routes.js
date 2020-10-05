const router = require("express").Router();

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
router.get("/google", (req, res) => {
  //hàndel with passport
  res.send("logging with google");
});

module.exports = router;
