var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var devicesSchema = new Schema({
  secret : String
});

//devicesSchema.statics.findOneByDevice = function(device) {
//  return this.findOne({
//    device
//  }).exec();
//};


module.exports = mongoose.model('device', devicesSchema);


// var mongoose = require('mongoose');
// var db = mongoose.createConnection('mongodb://localhost:27017/devices_development');
//
// var devicesSchema = new mongoose.Schema({
//   secret : String
// });
//
// module.exports = db.model('device', devicesSchema);
