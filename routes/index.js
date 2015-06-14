var Evernote = require('evernote').Evernote;

var config = require('../config.json');
var callbackUrl = "http://localhost:3000/oauth_callback";

var fs = require('fs');

// home page
exports.index = function(req, res) {
  if(req.session.oauthAccessToken) {
    var token = req.session.oauthAccessToken;
    var client = new Evernote.Client({
      token: token,
      sandbox: config.SANDBOX
    });
    var noteStore = client.getNoteStore();
    noteStore.listNotebooks(function(err, notebooks){
      req.session.notebooks = notebooks;
      res.render('index');
    });
  } else {
    res.render('index');
  }
};

// OAuth
exports.oauth = function(req, res) {
  var client = new Evernote.Client({
    consumerKey: config.API_CONSUMER_KEY,
    consumerSecret: config.API_CONSUMER_SECRET,
    sandbox: config.SANDBOX
  });

  client.getRequestToken(callbackUrl, function(error, oauthToken, oauthTokenSecret, results){
    if(error) {
      req.session.error = JSON.stringify(error);
      res.redirect('/');
    }
    else {
      // store the tokens in the session
      req.session.oauthToken = oauthToken;
      req.session.oauthTokenSecret = oauthTokenSecret;

      // redirect the user to authorize the token
      res.redirect(client.getAuthorizeUrl(oauthToken));
    }
  });

};

// OAuth callback
exports.oauth_callback = function(req, res) {
  var client = new Evernote.Client({
    consumerKey: config.API_CONSUMER_KEY,
    consumerSecret: config.API_CONSUMER_SECRET,
    sandbox: config.SANDBOX
  });

  client.getAccessToken(
    req.session.oauthToken,
    req.session.oauthTokenSecret,
    req.param('oauth_verifier'),
    function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
      if(error) {
        console.log('error');
        console.log(error);
        res.redirect('/');
      } else {
        // store the access token in the session
        req.session.oauthAccessToken = oauthAccessToken;
        req.session.oauthAccessTtokenSecret = oauthAccessTokenSecret;
        req.session.edamShard = results.edam_shard;
        req.session.edamUserId = results.edam_userId;
        req.session.edamExpires = results.edam_expires;
        req.session.edamNoteStoreUrl = results.edam_noteStoreUrl;
        req.session.edamWebApiUrlPrefix = results.edam_webApiUrlPrefix;
        res.redirect('/');
      }
    });
};

// Clear session
exports.clear = function(req, res) {
  req.session.destroy();
  res.redirect('/');
};

// Fetch Local File and Push to Evernote Web
function readFile(file, callback) {
  fs.readFile(file, 'utf8', function(err, data) {
      if (err) {
          console.log(err);
      }
      console.log('OK: ' + file);
      callback(data);
  });
}
var output = readFile('/Users/alexander.close2/Dropbox/books/kindleClippings/sandboxaddToEvernoteClippings.txt', function(data) {
var dataSplit = data.split('==========');
  for (var i = 0; i < dataSplit.length - 1; i++) {
    var title = dataSplit[i].split('\r\n- ')[0].replace('\r\n','');
    var text = dataSplit[i].split('\r\n\r\n')[1];

    console.log(title);
    console.log(text);

  }


});




/*
==========
Legacy (Kerr, James)
- Your Highlight on page 3 | location 120-121 | Added on Saturday, 7 February 2015 17:59:51

Successful leaders balance pride with humility: absolute pride in performance; total humility before the magnitude of the task.
==========
*/
/*
[ 'The Hard Thing About Hard Things: Building a Business When There Are No Easy Answers (Horowitz, Ben)\r\n- Your Highlight on page 172 | location 2574-2575 | Added on Saturday, 23 August 2014 19:17:04\r\n\r\n“Do I value internal or external knowledge more for this position?” will help you determine whether to go for experience or youth.\r\n',
  '\r\nZen and the Art of Motorcycle Maintenance: An Inquiry Into Values (Robert M. Pirsig)\r\n- Your Highlight at location 1598-1599 | Added on Wednesday, 17 September 2014 22:30:15\r\n\r\ngreatest part of his work is careful observation and precise thinking.\r\n',
  '' ]
*/


