var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userLogin = new Schema({
   
   employeeId:String,
   password:String 
})



module.exports = mongoose.model('userLogin', userLogin);

