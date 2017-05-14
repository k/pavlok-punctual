var express = require('express');
var app = express();

var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var oauth2Client = new OAuth2(
  "624000516468-ddec6ig5llj3qpo0gnmarv3u3jujb4d9.apps.googleusercontent.com",
  "BYNFUR9kCfad6KmbV9i6nixi",
  "https://io.k33.me:3000/auth/gcal/callback"
);

// generate a url that asks permissions for Google+ and Google Calendar scopes
var scopes = [
  'https://www.googleapis.com/auth/calendar'
];

var gcal_url = oauth2Client.generateAuthUrl({
  // 'online' (default) or 'offline' (gets refresh_token)
  access_type: 'offline',

  // If you only need one scope you can pass it as a string
  scope: scopes,

  // Optional property that passes state parameters to redirect URI
  // state: { foo: 'bar' }
});

var calendar = google.calendar({
  version: 'v3',
  auth: oauth2Client
});

var pavlok = require('pavlok-beta-api-login');
pavlok.init("7f53e074cafe5151525a0934586bd39d4f7bc1156e67d53b862b9fa3dea1c6bd",
            "ff355d4688bc72b9641035a0edb8a8b569e67a305e32cf5fe329e9525b324513", {
    "verbose": true,
    "app" : app,
    "message": "Hello! Stay punctual or else...",
    "callbackUrl": "http://io.k33.me:3000/pavlok/result",
    "callbackUrlPath": "/pavlok/result",
    "successPath": "/success",
    "errorPath": "/error"
});

app.get("/auth/pavlok", function(req, res) {
    pavlok.auth(req, res);
});

app.get("/auth/gcal", function(req, res) {
    res.redirect(gcal_url)
});

app.get("/success", function(req, res) {
    console.log("Successfully authenticated!");
});

app.get("/error", function(req, res) {
    console.log("Failed to authenticate");
});

app.get("/auth/gcal/callback", function(req, res) {
    if (req.code) {
        oauth2Client.getToken(req.code, function (err, tokens) {
            // Now tokens contains an access_token and an optional refresh_token. Save them.
            if (!err) {
                oauth2Client.setCredentials(tokens);
            }
        });
        res.redirect("/success")
    } else {
        res.redirect("/error")
    }
});

app.get("/vibrate", function(req, res) {
    pavlok.vibrate({ "request": req });
    res.send("vibrate sent");
});

app.get("/beep", function(req, res) {
    pavlok.beep({"intensity": 255, "request": req });
    res.send("beep sent");
});

app.get("/zap", function(req, res) {
    pavlok.zap({ "intensity": 30, "request": req });
    res.send("zap sent");
});

app.get("/calendarList", function(req, res) {
    console.log(calendar.calendarList.list)
    res.send(calendar.calendarList.list)
});

app.listen(3000, function () {
    console.log('listing on 3000');
});
