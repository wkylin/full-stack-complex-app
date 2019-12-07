// module.exports = {
//   login: function () {
//   },
//   logout: function () {
//   }
// };


const User = require('../models/User');

// exports.login = function (req, res) {
//   let user = new User(req.body);
//   user.login(function (result) {
//     res.send(result);
//   });
// };

exports.login = function (req, res) {
  let user = new User(req.body);
  user.login().then(function (result) {
      req.session.user = {
        favColor: "blue",
        username: user.data.username
      };
      res.send(result);
    }
  ).catch(function (err) {
      res.send(err);
    }
  );
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
  
  if (req.session.user) {
    res.send('Welcome to the actual app!');
  } else {
    res.render('home-guest');
  }
  
};
