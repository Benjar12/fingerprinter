var express = require('express'),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    md5 = require('MD5'),
    app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

var deps = {
    mongoose: mongoose,
    md5: md5
};

mongoose.connect('mongodb://localhost/fingerprint', loadModels);

function loadModels(err){
    if(err) throw err;
    deps.models = {
        fingerprints: require('./models/fingerprints')(deps)
    };
    
}

//normally static files should be served through nginx but
//as a poc this will work.
var page = null;
fs.readFile('../static/demo.html', 'utf8', function(err, data) {
  if (err) throw err;
  page = data;
});
var jsfile = null;
fs.readFile('../static/demo.js', 'utf8', function(err, data) {
  if (err) throw err;
  jsfile = data;
});

app.get('/', function (req, res) {
    console.log(req.headers, '\n\n', req.connection.remoteAddress);
    res.send(page);
});
app.get('/demo.js', function (req, res) {
    res.header("Content-Type", "text/javascript");
    res.send(jsfile);
});

var route = require('./app/finger')(deps);
app.post('/finger', route.post);

var server = app.listen(3000, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('App listening at http://%s:%s', host, port);

});