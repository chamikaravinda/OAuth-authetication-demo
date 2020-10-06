const router = require("express").Router();
const { google } = require("googleapis");
const axios = require("axios");
const keys = require("../config/keys");

const callbackURL = "/auth/google/redirect";
const clientID = keys.google.clientID;
const clientSecret = keys.google.clientSecret;

const oAuth2Client = new google.auth.OAuth2(
  clientID,
  clientSecret,
  callbackURL
);

const authCheck = (req, res, next) => {
  if (!req.user) {
    //if user not logged in
    res.redirect("/auth/login");
  } else {
    next();
  }
};

const findMessages = async (auth) => {
  var gmail = google.gmail("v1");
  var messages = [];
  return await gmail.users.messages
    .list({
      auth: auth,
      userId: "me",
      maxResults: 10,
      q: "",
    })
    .then(async (response) => {
      for (const message of response.data.messages) {
        await gmail.users.messages
          .get({
            auth: auth,
            userId: "me",
            id: message.id,
          })
          .then(async (mailData) => {
            let mail_data = {
              id: mailData.data.id,
              labelIds: mailData.data.labelIds,
              snippet: mailData.data.snippet,
            };
            return await messages.push(mail_data);
          });
      }
      return messages;
    });
};

router.get("/", authCheck, async (req, res) => {
  const accessToken = req.user.accessToken;
  const refreshToken = req.user.refreshToken;

  oAuth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  const oauth2 = google.oauth2({ version: "v2", auth: oAuth2Client });
  const mails = await findMessages(oAuth2Client);
  console.log(mails);
  res.render("emails", { user: req.user });
});

module.exports = router;
