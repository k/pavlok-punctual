let express = require('express');
let Promise = require('bluebird');
let redis = require('redis');
let fs = require('fs');
let StringDecoder = require('string_decoder').StringDecoder;
let decoder =  new StringDecoder('utf8');

let r_client = redis.createClient({ host: 'redis'});
Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

let SECRETS_DIR = __dirname + '/secrets/';

let BASEURL = "http://io.k33.me:3000/"; // if production
if (process.env.NODE_ENV == 'development') {
    BASEURL = "http://localhost:3000/";
}

let google = require('googleapis');
let OAuth2 = google.auth.OAuth2;
let gcal_key_json = decoder.write(fs.readFileSync(SECRETS_DIR+'gcal.json'));
let gcal_keys = JSON.parse(gcal_key_json);
let oauth2Client = new OAuth2(
    gcal_keys.web.client_id,
    gcal_keys.web.client_secret,
    BASEURL+"auth/gcal/callback"
);

// generate a url that asks permissions for Google+ and Google Calendar scopes
let scopes = [
  'https://www.googleapis.com/auth/calendar.readonly'
];
var TOKEN_DIR =  __dirname + '/.credentials/';
var TOKEN_PATH =  TOKEN_DIR + 'gcal.oathtoken.json';

let gcal_url = oauth2Client.generateAuthUrl({
  // 'online' (default) or 'offline' (gets refresh_token)
  access_type: 'offline',

  // If you only need one scope you can pass it as a string
  scope: scopes,

  // Optional property that passes state parameters to redirect URI
  // state: { foo: 'bar' }
});

// Check if we have previously stored a token.
fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
        console.log("No token found, continue");
        // No token available, pass
    } else {
        console.log("Token loaded");
        oauth2Client.credentials = JSON.parse(token);
    }
});

var calendar = google.calendar({
  version: 'v3',
  auth: oauth2Client
});

let app = express();

let pavlok_key_json = decoder.write(fs.readFileSync(SECRETS_DIR+'pavlok.json'))
let pavlok_keys = JSON.parse(pavlok_key_json)
let pavlok = require('pavlok-beta-api-login');

// Included before pavlok.init to avoid a runtime error
app.get("/auth/pavlok", function(req, res) {
    pavlok.auth(req, res);
});

pavlok.init(pavlok_keys.client_id,
    pavlok_keys.client_secret, {
        "verbose": true,
        "app" : app,
        "message": "Hello! Stay punctual or else...",
        "callbackUrl": BASEURL+"pavlok/result",
        "callbackUrlPath": "/pavlok/result",
        "successPath": "/success",
        "errorPath": "/error"
});

app.get("/auth/gcal", function(req, res) {
    res.redirect(gcal_url)
});

app.get("/success", function(req, res) {
    console.log("Successfully authenticated!");
    res.send("Thanks!");
});


app.get("/error", function(req, res) {
    console.log("Failed to authenticate");
    res.send("Failed to authenticate :(");
});

app.get("/auth/gcal/callback", function(req, res) {
    console.log(req)
    if (req.query.code) {
        oauth2Client.getToken(req.query.code, function (err, tokens) {
            // Now tokens contains an access_token and an optional refresh_token. Save them.
            console.log(req.query)
            if (!err) {
                console.log(tokens);
                oauth2Client.setCredentials(tokens);
                storeToken(tokens, 'gcal')
                res.redirect("/success");
            } else {
                console.log(err);
                res.redirect("/error");
            }
        });
    } else {
        res.redirect("/error");
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
    load_calendar();
});

app.listen(3000, function () {
    console.log('listing on 3000');
});

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token, service) {
    try {
        fs.mkdirSync(TOKEN_DIR);
    } catch (err) {
        if (err.code != 'EEXIST') {
            throw err;
        }
    }
    fs.writeFile(TOKEN_PATH, JSON.stringify(token));
    console.log('Token stored to ' + TOKEN_PATH);
}

/**
 * Load calendar list
 *
 */
function load_calendar() {
    calendar.calendarList.list({}, function(err, res) {
        if (err)  console.log("Error loading calendar list");
        var day_later = new Date();
        day_later.setDate(day_later.getDate() + 1);
        var isostring = day_later.toISOString();
        for (var obj of res.items) {
            var events = calendar.events.list({
                calendarId: obj.id,
                timeMax: isostring,
                timeMin: new Date().toISOString()
            }, function(err, res) {
                // find gps from locations and add to database
                console.log(err);
                console.log(res);
            });
        }
    });
}
