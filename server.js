var express = require('express');
var env = require('dotenv').config()
var ejs = require('ejs');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
const emailer = require("./utilities/email");

//Yashvi - mongodb+srv://admin:admin@cluster0.kjhke.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
//Naitik - mongodb+srv://admin:admin@cluster0.aikfq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
mongoose.connect('mongodb+srv://admin:admin@cluster0.icr3v.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err) => {
  if (!err) {
    console.log('MongoDB Connection Succeeded.');
  } else {
    console.log('Error in DB connection : ' + err);
  }
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
});

app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');	
app.use(express.static("public"));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/views'));

var index = require('./routes/index');
app.use('/', index);

class AuthController1{
  constructor() {}
  async emailPdf(req, res) {
    console.log("helloo");
    try {
      if (req.body) {
        await emailer(req.body);
        console.log("Email is send");
        res.json({
          result: "email send "
        });
      } else {
        res.json({
          result: "enter data of patient"
        });
      }
    } catch (err) {
      console.log(err);
      res.json({ err });
    }
  }
}

const AuthCtrl1 = new AuthController1();
app.post('/email', AuthCtrl1.emailPdf);
// app.post("/email", async function(req, res) {
//   console.log("helloo");
//   try {
//     if (req.body) {
//       await emailer(req.body);
//       console.log("Email is send");
//       res.json({
//         result: "email send "
//       });
//     } else {
//       res.json({
//         result: "enter data of patient"
//       });
//     }
//   } catch (err) {
//     console.log(err);
//     res.json({ err });
//   }
// });

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log('Server is started on http://127.0.0.1:'+PORT);
});

module.exports = app;
