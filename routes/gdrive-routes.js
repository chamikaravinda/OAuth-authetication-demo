const router = require("express").Router();
const { google } = require("googleapis");
const passport = require("passport");
const keys = require("../config/keys");

const authCheck = (req, res, next) => {
  if (!req.user) {
    //if user not logged in
    res.redirect("/auth/login");
  } else {
    next();
  }
};

router.get("/", authCheck, async (req, res) => {
  res.render("gdrive", { user: req.user });
});

router.post("/upload", function (req, res) {
  // config google drive with client token
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: req.user.accessToken,
  });

  const drive = google.drive({
    version: "v3",
    auth: oauth2Client,
  });

  //move file to google drive
  let { name: filename, mimetype, data } = req.files.file_upload;

  const driveResponse = drive.files.create({
    requestBody: {
      name: filename,
      mimeType: mimetype,
    },
    media: {
      mimeType: mimetype,
      body: Buffer.from(data).toString(),
    },
  });

  driveResponse
    .then((data) => {
      if (data.status == 200) res.redirect("/?file=upload");
    })
    .catch((err) => {
      throw new Error(err);
    });
});

module.exports = router;
