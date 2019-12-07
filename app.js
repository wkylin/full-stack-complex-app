const path = require('path');
const express = require('express');
const session = require('express-session');

const app = express();

let sessionOptions = session({
  secret: 'Javascript is so cool',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true
  }
});

app.use(sessionOptions);

const router = require('./router.js');
// console.log(router);

app.use(express.urlencoded({extends: false}));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));
app.set('views', 'views');
app.set('view engine', 'ejs');


// app.get('/', function (req, res) {
//   res.render('home-guest');
// });

app.use('/', router);

module.exports = app;
// app.listen(3000, () =>  {
//   console.log('Server start at port 3000!');
// });
