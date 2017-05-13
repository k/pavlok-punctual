var express = require('express');
var app = express();
var pavlok = require('pavlok-beta-api-login');

pavlok.init("7f53e074cafe5151525a0934586bd39d4f7bc1156e67d53b862b9fa3dea1c6bd",
            "ff355d4688bc72b9641035a0edb8a8b569e67a305e32cf5fe329e9525b324513", {
    "verbose": true,
    "app" : app,
    "message": "Hello! Stay punctual or else...",
    "callbackUrl": "http://www.io.k33.me:3000/pavlok/result",
    "callbackUrlPath": "/pavlok/result",
    "successUrl": "/success",
    "errorUrl": "/error"
});

app.get("/auth", function(req, res) {
    pavlok.auth(req, res);
});

app.get("/success", function(req, res) {
    console.log("It worked!");
});

app.get("/error", function(req, res) {
    console.log("It failed...");
});

app.listen(3000, function () {
    console.log('listing on 3000');
});
