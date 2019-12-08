// module.exports = {
//   login: function () {
//   },
//   logout: function () {
//   }
// };


const User = require('../models/User');
const Post = require('../models/Post');

// exports.login = function (req, res) {
//   let user = new User(req.body);
//   user.login(function (result) {
//     res.send(result);
//   });
// };

exports.mustBeLoggedIn = function(req, res, next){
  if(req.session.user) {
    next();
  } else {
    req.flash('errors', 'You must be logged in to perform that ');
    req.session.save(function(){
      res.redirect('/');
    })
  }
};

exports.login = function (req, res) {
  let user = new User(req.body);
  user.login().then(function (result) {
      req.session.user = {
        avatar: user.avatar,
        username: user.data.username,
        _id: user.data._id,
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
      avatar: user.avatar,
      username: user.data.username,
      _id: user.data._id
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
    res.render('home-dashboard');
    // res.render('home-dashboard', {
    //   avatar:req.session.user.avatar,
    //   username: req.session.user.username
    // });
    // res.send('Welcome to the actual app!');
  } else {
    res.render('home-guest', {
      regErrors: req.flash('regErrors')
    });
  }
  
};


exports.ifUserExists = function(req, res, next) {
  // next();
  
  User.findByUserName(req.params.username).then(function(userDocument){
    req.profileUser = userDocument;
    next();
  }).catch(function(){
    res.render('404');
  })
};

exports.profilePostsScreen = function(req, res){
  Post.findByAuthorId(req.profileUser._id).then(function(posts){
  
    res.render('profile', {
      posts: posts,
      profileUserName: req.profileUser.username,
      profileAvatar: req.profileUser.avatar,
    });
  }).catch(function(){
    res.render('404');
  });
  
};
