var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var request = require('request');
var Device = require('./app/models/devices/device');

var mqtt = require('mqtt');

var host = 'localhost';
//var port = '1883';
var port = process.env.PORT || 8006;

var ascoltatori = require('ascoltatori');
//    ,ascoltatore;

var settings = {
  type : 'redis',
  redis : require('redis'),
  db : 12,
  port : 6379,
  return_buffers : true,
  host : 'localhost'
};


// parse application/json
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(methodOverride());
//app.use(app.router);
app.use(express.static(__dirname + '/app/assets'));
//app.set('port', 8006);

/* ---------------
  Express Server
------------------ */

app.listen(port, function() {
  console.log("Nodes server listening on ", port);
});


/* -------------------------------------------
  From WebServer to the Physical Device (/GET)
 ------------------------------------------- */
app.use('/mqtt', require('./routes/mqtt'));




/* ------------------------------------
  From the Physical Device to WebServer
--------------------------------------- */

ascoltatori.build(settings, function(err, ascoltatore) {
//  ascoltatore = _ascoltatore;
  console.log('bulid');
  ascoltatore.subscribe('devices/*', function() {
    console.log('TOPIC', arguments['0'], 'PAYLOAD', arguments['1']);
    var data = arguments['0'].split('/');

    if(data[2] == 'set') {
      sync(data[1], arguments['1']);
    }
  });
});

var sync = function(id, payload) {
  var uri = 'http://localhost:8000' + '/devices/' + id + '/properties';
  var json = JSON.parse(new Buffer(payload.message, 'hex'),toString('utf8'));
  var options = { uri : uri, method : 'PUT', body : json, json : true};

  Device.findOne({ _id : id}, function(err, doc) {
    if(err) console.log("ERROR", err.message);
    if(doc) {
      options.headers = setHeaders(doc.secret);

      request(options, function(err, response, body) {
        if(err) console.log("ERROR", err.message);
        console.log("Sent requres to ", uri, json);
      });
    }
  });
};

var setHeaders = function(secret) {
  return { 'X-Physical-Secret': secret, 'Content-Type': 'application/json'};
};


/* =======================
    CONNECT TO MONGODB SERVER
==========================*/
mongoose.connect('mongodb://localhost:27017/devices-development');
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    console.log('connected to mongodb server');
});

module.exports = app;
