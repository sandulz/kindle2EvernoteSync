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

// Click Here to Upload Button
exports.upload = function(req, res) {

  // Fetch File From Local Filesystem
  function readFile(file, callback) {
    fs.readFile(file, 'utf8', function(err, data) {
        if (err) {
            console.log(err);
        }
        console.log('OK: ' + file);
        callback(data);
    });
  }

  // Slice File and Push to Evernote
  var output = readFile('/Users/alexander.close2/Dropbox/books/kindleClippings/sandboxaddToEvernoteClippings.txt', function(data) {
  var dataSplit = data.split('==========');
    for (var i = 0; i < dataSplit.length - 1; i++) {
      var noteTitle = dataSplit[i].split('\r\n- ')[0].replace('\r\n','');
      var noteBody = dataSplit[i].split('\r\n\r\n')[1];

      console.log(noteTitle);
      console.log(noteBody);

    }
  })
  


  // function makeNote(noteStore, noteTitle, noteBody, parentNotebook, callback) {
  // 
  //   var nBody = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
  //   nBody += "<!DOCTYPE en-note SYSTEM \"http://xml.evernote.com/pub/enml2.dtd\">";
  //   nBody += "<en-note>" + noteBody + "</en-note>";
  // 
  //   // Create note object
  //   var ourNote = new Evernote.Note();
  //   ourNote.title = noteTitle;
  //   ourNote.content = nBody;
  // 
  //   // parentNotebook is optional; if omitted, default notebook is used
  //   // if (parentNotebook && parentNotebook.guid) {
  //     // ourNote.notebookGuid = parentNotebook.guid;
  //   // }
  // 
  //   // Attempt to create note in Evernote account
  //   noteStore.createNote(ourNote, function(err, note) {
  //     if (err) {
  //       // Something was wrong with the note data
  //       // See EDAMErrorCode enumeration for error code explanation
  //       // http://dev.evernote.com/documentation/reference/Errors.html#Enum_EDAMErrorCode
  //       console.log(err);
  //     } else {
  //       callback(note);
  //     }
  //   });
  // 
  // }




  
};

// Clear session
exports.clear = function(req, res) {
  req.session.destroy();
  res.redirect('/');
};

