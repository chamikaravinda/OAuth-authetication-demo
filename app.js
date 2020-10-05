const express = require("express");
const authRouter = require("./routes/auth-routes");
const passportSetup = require("./config/passport.setup")

const app = express();

//set up view engine
app.set("view engine", "ejs");

//set up routes
app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.render("home");
});
app.listen(3000, () => {
  console.log("Server is running on the port 3000");
});
