var pavlok = require('pavlok-beta-api-login');
pavlok.init("a895e9363bbebe1f464a999e26aa0e1506e3de8c42c076340f1592d287409c51",
            "2fb36a991642f9c495c709aad047225e4b7d1c1db5b7992b3aa6dbd49ccf2611");
pavlok.login(function(result, code) {
    if (result) {
        pavlok.beep(244, function() {
            console.log("SLDKFJLSDKJF")
        }, "hello beep")
    } else {
        console.log("Failed :(")
    }
});
