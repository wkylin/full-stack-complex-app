// module.exports = {
//   login: function () {
//   },
//   logout: function () {
//   }
// };


const User = require('../models/User');

exports.login = function (req, res) {
  let user = new User(req.body);
  user.login(function (result) {
    res.send(result);
  });
};

exports.logout = function () {

};

exports.register = function (req, res) {
  // console.log(req.body);
  
  let user = new User(req.body);
  
  user.register();
  
  if (user.errors.length) {
    res.send(user.errors);
  } else {
    res.send('Congrats, there are no errors.');
  }
  
  // res.send('Thanks for trying to register!')
  
};

exports.home = function (req, res) {
  res.render('home-guest');
};
