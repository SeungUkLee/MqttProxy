const Device = require('../../../app/models/devices/device');


exports.deviceCheck = function(req, res) {
  var status = 401;

  const deviceCheck = function(device) {
    if(device) {

    }
  }
};

app.put('/mqtt/devices/:id', function(req, res) {
  var status = 401;
  console.log("Receiving request", req.body);
  console.log("req.get('X-Physical-Secret') : ",req.get('X-Physical-Secret'));
  console.log("req.params.id : ", req.params.id);
  console.log("req.params.id type", typeof(mongoose.Types.ObjectId(req.params.id)));
  console.log("req.params    : ", req.params);
  //var _id = mongoose.Types.ObjectId.fromString(req.params.id);
  //Device.findOne({_id :req.params.id, secret : req.get('X-Physical-Secret')}, function(err, doc) {
  // 밑에줄 안되네.. 위에 주석 var _id 도 안됨
  Device.find({}, function(err, doc){
    if(err) console.log(err.message);
    res.send(doc);
  });
  //Device.findOne({_id : mongoose.Types.ObjectId(req.params.id), secret : req.get('X-Physical-Secret')}, function(err, doc) {
  //  if(err) console.log(err.message);
  //  console.log("doc : ",doc);
    // if(doc) {
    //   status = 202;
    //   console.log("device findone success~");
    //   publish(req, '/get/');
    // }
  //  res.send(doc);
  //  console.log("zz");
    //res.status(status).json({status : status});
  //});
});

var publish = function(req, mode) {
  payload = { message : new Buffer(JSON.stringify(req.body)).toString('hex'), binary : true};
  console.log("publish payload : ", payload);
  var topic = 'devices/' + req.params.id + mode;
  console.log("publish topic : ", topic);
  ascoltatore.publish(topic, payload, function() {
    console.log('[API REQ] Message published to the topic', topic, payload);
  });
};
