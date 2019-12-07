const express = require('express');
const app = express();
const path = require('path');

const router = require('./router.js');
// console.log(router);

app.use(express.static(path.join(__dirname, "public")));
app.set('views', 'views');
app.set('view engine', 'ejs');


// app.get('/', function (req, res) {
//   res.render('home-guest');
// });

app.use('/', router);

app.listen(3000, () =>  {
  console.log('Server start at port 3000!');
});
