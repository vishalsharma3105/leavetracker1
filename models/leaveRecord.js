var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var leaveRecord = new Schema({
    employeeId: String,
    employeeName: String,
    managerId: String,
    managerName: String,
    email:String,
    password:String,
    leaves: [{
         //leaveID:String,
         // startDate: Date, 
         // endDate: Date,
         date:Date,
         leaveType: String,
         timeStamp: Date,
         deleteFlag:String
        // count:String        
     }]    
})



module.exports = mongoose.model('leaveRecord', leaveRecord);

