var express = require('express');
var port = process.env.PORT || 8000; 
var app = express();
var bodyParser = require('body-parser')

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//  // next();
// });


app.use(express.static("app"));  
  
app.get('/', function (req, res) {  
    res.redirect('/');  
});  
  



var recordsRoute = require('./routes/recordsRoute')
var mongoose = require('mongoose');
mongoose.connect('mongodb://vishalsharma3105:123456@ds149763.mlab.com:49763/meanstackvishal');

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));

// app.use('/dogRoutes',require('./routes/dogRoutes'))

app.use('/recordsroute',recordsRoute)

app.listen(port, function() {
    console.log('The server is running, ' +
        ' please open your browser at http://localhost:%s',
        port);
});
