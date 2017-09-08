var express = require('express')
var app = express();
var bodyParser = require('body-parser');
var router = express.Router()
var leaveRecords = require('../models/leaveRecord')
var userLogin = require('../models/userLogin')
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var superSecret = require('../config');

var bcrypt = require('bcrypt-nodejs');

const SALT_ROUNDS = 10;

// Admin can create new employee with this API
router.post('/createNewEmployee', function(req, res) {

    //console.log(req.body.publicHolidays);
    //console.log(req.body.publicHolidays[0]);
    //console.log(req.body.publicHolidays[0].date);
    console.log(req.body.employeeId)
    leaveRecords.findOne({ employeeId: req.body.employeeId }, function(err, data) {
        if (err) res.status(500).json({
            success: false,
            msg: "Database error"
        })
        console.log(data);
        if (data) {
            console.log('Employee Already Exists')
            res.json('Employee Already Exists');
        } else {
            var hashedPasswordValue = hashedPassword(req.body.password);

            console.log("from route::" + hashedPasswordValue)
            var leaveRecord1 = new leaveRecords({

                employeeId: req.body.employeeId,
                employeeName: req.body.employeeName,
                managerId: req.body.managerId,
                managerName: req.body.managerName,
                email: req.body.email,
                password: hashedPasswordValue 
                // ,
                // leaves: {

                //     date: req.body.date,
                //     leaveType: req.body.leaveType,
                //     FloatingHolidayFlag: req.body.FloatingHolidayFlag,
                //     deleteFlag: req.body.deleteFlag,
                //     timeStamp: Date()
                // }
            })

            //console.log("--------"+dog1)
            leaveRecord1.save(function(err, data) {
                console.log("inside save");
                if (err) {
                    console.log(err)
                }
                res.json(data)
            })


        }

    })




})


router.post('/loginUser', function(req, res) {

    var userLogin1 = new userLogin({

        employeeId: req.body.employeeId,
        password: req.body.password,

    })
    console.log(req.body.employeeId)
    console.log(req.body.password)
    leaveRecords.findOne({ employeeId: userLogin1.employeeId }, function(err, data) {
        if (err) res.status(500).json({
            success: false,
            msg: "Database error"
        })

        else {
            //data.status = 'done'
            //data.completed_date = new Date()
            console.log(data)
            console.log(userLogin1.password);
            bcrypt.compare(userLogin1.password, data.password, function(err, res1) {
                //console.log(data.password + "hashed")
                //console.log(userLogin1.password + "hashed")
                console.log(res1)
                if (res1 === true) {
                    //console.log("called: " + res1) // returns true!
                    var data1 = {

                        "_id": data._id,
                        "employeeId": data.employeeId,
                        "employeeName": data.employeeName,
                        "managerId": data.managerId,
                        "managerName": data.managerName,
                        "email": data.email,


                    }



                    //console.log(superSecret.secret);
                    //console.log(data);
                    var token = jwt.sign(data1, superSecret.secret, {
                        expiresIn: 86400 // expires in 24 hours
                    });

                    data1.token = token;

                    res.json({
                        success: true,

                        details: data1
                    })
                } else {

                    res.json("Paasword is Wrong baby")
                }
            });
        }

    });



});

hashedPassword = function(password) {

    // Load the bcrypt module

    // Generate a salt
    console.log("salt not called");
    var salt = bcrypt.genSalt(SALT_ROUNDS, function(err, res) {
        // res = false
        console.log("salt being called")
    });
    console.log("salt called");
    // Hash the password with the salt
    var hash = bcrypt.hashSync(password, salt, function(err, hash) { console.log("hashed") });
    console.log(hash);
    return hash;
}


// Employee can update his leave from here.
router.post('/updateLeave', function(req, res) {
    if (!req.body._id) {
        res.json({
            success: false,
            msg: "Data not provided"
        })
    } else {
        leaveRecords.findById({ _id: req.body._id }, function(err, data) {
            if (err) res.status(500).json({
                success: false,
                msg: "Database error"
            })

            else {
                //data.status = 'done'
                //data.completed_date = new Date()
                var date1 = new Date(req.body.startDate);
                var date2 = new Date(req.body.endDate);
                var timeDiff = Math.abs(date2.getTime() - date1.getTime());
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                data.leaves.push({ leaveId: data.leaves.length, startDate: req.body.startDate, endDate: req.body.endDate, leaveType: req.body.leaveType, timeStamp: Date(), deleteFlag: req.body.deleteFlag, count: diffDays+1 });
                data.save(function(err, newData) {
                    if (err)

                        //    next();
                        res.status(500).json({
                            success: false,
                            msg: "Database error"
                        })
                    else {
                        res.json({
                            success: true,
                            data: newData
                        })
                    }
                })
            }
        })
    }
})

router.post('/getAll', function(req, res) {
    var token = req.body.token;
    var tokenverified = false;
    console.log(token)
    jwt.verify(token, superSecret.secret, function(err, decoded) {
        if (err) {
            return res.json({ success: false, message: 'Failed to authenticate token.' });
        } else {
            // if everything is good, save to request for use in other routes
            req.decoded = decoded;
            tokenverified = true;

        }
    });

    if (tokenverified == true) {
        leaveRecords.find(function(err, data) {
            if (err) res.status(500).json({
                success: false,
                msg: "Database error"
            })

            else {
                //data.status = 'done'
                //data.completed_date = new Date()
                res.send(data)



            }
        })
    } else {
        res.send("invalid token");
    }



})

router.post('/getbyId', function(req, res) {

    leaveRecords.findById({ _id: req.body._id }, function(err, data) {
        if (err) res.status(500).json({
            success: false,
            msg: "Database error"
        })

        else {
            //data.status = 'done'
            //data.completed_date = new Date()
           // console.log(data.leaves[0]._id)
            res.json(data)



        }
    })





})

router.post('/deleteLeavesbyId', function(req, res) {

    leaveRecords.findById({ _id: req.body._id }, function(err, data) {

        var foundFlag = false;
        if (err) res.status(500).json({
            success: false,
            msg: "Database error"
        })

        else {
            //data.status = 'done'
            //data.completed_date = new Date()
            if (data.leaves.length == 0)
                res.send("no leaves found")
            else
                data.leaves.forEach(function(item) {
                    //console.log(item._id)
                    if (item._id == req.body.leaveId) {
                        console.log(req.body.leaveId)
                        console.log("inside");
                        foundFlag = true;
                        // console.log(item.leaves)
                        data.leaves.pull(item)
                        data.save(function(err, newData) {
                            if (err)

                                //    next();
                                res.status(500).json({
                                    success: false,
                                    msg: "Database error"
                                })
                            else {
                                res.json({
                                    success: true,
                                    data: newData
                                })
                            }
                        })
                        //res.json(item)
                    }

                })

            if (foundFlag == false) {
                res.send("nothing found");
            }


        }
    })


})





module.exports = router;