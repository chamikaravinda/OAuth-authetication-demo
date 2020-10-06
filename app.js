const express = require("express");
const authRouter = require("./routes/auth-routes");
const profileRouter = require("./routes/profile-routes");
const emailRouter = require("./routes/email-routes");
const passportSetup = require("./config/passport.setup");
const mongoose = require("mongoose");
const keys = require("./config/keys");
const cookieSession = require("cookie-session");
const passport = require("passport");

const app = express();

//set up view engine
app.set("view engine", "ejs");

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey],
  })
);

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

//connect to mongodb
mongoose.connect(keys.mongodb.dbURI, () => {
  console.log("connected to the mongo DB");
});

//set up routes
app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/emails", emailRouter);

app.get("/", (req, res) => {
  res.render("home", { user: req.user });
});

app.listen(3000, () => {
  console.log("Server is running on the port 3000");
});
