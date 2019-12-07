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
      // res.send(result);
      req.session.save(function () {
        res.redirect('/');
      });
    }
  ).catch(function (err) {
      // res.send(err);
      req.flash('errors', err);
      req.session.save(function () {
        res.redirect('/');
      });
    }
  );
};


exports.logout = function (req, res) {
  // req.session.destroy();
  // res.send('You are now logged out!');
  req.session.destroy(function () {
    res.redirect('/');
  });
};

exports.register = function (req, res) {
  // console.log(req.body);
  
  let user = new User(req.body);
  
  user.register().then(() => {
    
    req.session.user = {
      username: user.data.username
    };
    req.session.save(function () {
      res.redirect('/');
    });
  }).catch((regErrors) => {
    regErrors.forEach(function (error) {
      req.flash('regErrors', error);
    });
    req.session.save(function () {
      res.redirect('/');
    });
  });
};

// exports.register = function (req, res) {
//   // console.log(req.body);
//
//   let user = new User(req.body);
//
//   user.register();
//
//   if (user.errors.length) {
//     // res.send(user.errors);
//     user.errors.forEach(function(error){
//       req.flash('regErrors', error);
//     });
//     req.session.save(function(){
//       res.redirect('/');
//     })
//
//   } else {
//     res.send('Congrats, there are no errors.');
//   }
//
//   // res.send('Thanks for trying to register!')
//
// };

exports.home = function (req, res) {
  
  if (req.session.user) {
    res.render('home-dashboard', {
      username: req.session.user.username
    });
    // res.send('Welcome to the actual app!');
  } else {
    res.render('home-guest', {
      errors: req.flash('errors'),
      regErrors: req.flash('regErrors')
    });
  }
  
};
