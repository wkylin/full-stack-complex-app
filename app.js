const path = require('path');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const markdown = require('marked');
const sanitizeHtml = require('sanitize-html');
const app = express();

let sessionOptions = session({
  secret: 'Javascript is so cool',
  store: new MongoStore({
    client: require('./db')
  }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true
  }
});

app.use(sessionOptions);
app.use(flash());

app.use(function (req, res, next) {
  
  // markdown
  res.locals.filterUserHTML = function (content) {
    return sanitizeHtml(markdown(content), { allowedTags: ['p', 'br', 'ul', 'ol', 'li', 'strong', 'bold', 'i', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a'], allowedAttributes: {} });
  };
  
  res.locals.errors = req.flash('errors');
  res.locals.success = req.flash('success');
  // make current user id available on the req object
  if (req.session.user) {
    req.visitorId = req.session.user._id;
  } else {
    req.visitorId = 0;
  }
  
  // make user session data available from within view templates
  
  res.locals.user = req.session.user;
  // console.log(req.session.user);
  next();
});
const router = require('./router.js');
// console.log(router);

app.use(express.urlencoded({ extends: false }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));
app.set('views', 'views');
app.set('view engine', 'ejs');


// app.get('/', function (req, res) {
//   res.render('home-guest');
// });

app.use('/', router);

const server = require('http').createServer(app);
const io = require('socket.io')(server);
io.on('connection', function (socket) {
  // console.log('A new user connected! ');
  socket.on('chatMessageFromBrowser', function (data) {
    // console.log(data.message);
    io.emit('chatMessageFromServer', { message: data.message });
  });
});
module.exports = server;

// module.exports = app;
// app.listen(3000, () =>  {
//   console.log('Server start at port 3000!');
// });
