// module.exports = {
//   login: function () {
//   },
//   logout: function () {
//   }
// };


const User = require('../models/User');
const Post = require('../models/Post');
const Follow = require('../models/Follow');

// exports.login = function (req, res) {
//   let user = new User(req.body);
//   user.login(function (result) {
//     res.send(result);
//   });
// };

exports.sharedProfileData = async function(req, res, next){
  let isFollowing = false;
  let isVisitorProfile = false;
  if(req.session.user){
    isVisitorProfile = req.profileUser._id.equals(req.session.user._id);
   isFollowing =  await Follow.isVisitorFollowing(req.profileUser._id, req.visitorId);
  }
  req.isFollowing= isFollowing;
  req.isVisitorProfile = isVisitorProfile;
  
  // retrieve post follower and following counts
  let postCountPromise = await Post.countPostsByAuthor(req.profileUser._id);
  let followerCountPromise = await Follow.countFollowersById(req.profileUser._id);
  let followingCountPromise = await Follow.countFollowingById(req.profileUser._id);
  let [postCount, followerCount, followingCount] = await Promise.all([postCountPromise,followerCountPromise, followingCountPromise]);
  req.postCount = postCount;
  req.followerCount = followerCount;
  req.followingCount = followingCount;
  
  next();
};

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

exports.home = async function (req, res) {
  
  if (req.session.user) {
    
    let posts = await Post.getFeed(req.session.user._id);
  
    console.log('posts>>>>>', posts);
    res.render('home-dashboard', {posts: posts});
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
      currentPage:'posts',
      posts: posts,
      profileUserName: req.profileUser.username,
      profileAvatar: req.profileUser.avatar,
      isFollowing: req.isFollowing,
      isVisitorProfile: req.isVisitorProfile,
      counts:{
        postCount: req.postCount,
        followerCount: req.followerCount,
        followingCount: req.followingCount
      }
    });
  }).catch(function(){
    res.render('404');
  });
  
};


exports.profileFollowersScreen =async function(req, res){

  try{
    let followers = await Follow.getFollowersById(req.profileUser._id);
    res.render('profile-followers', {
      currentPage:'followers',
      followers: followers,
      profileUserName: req.profileUser.username,
      profileAvatar: req.profileUser.avatar,
      isFollowing: req.isFollowing,
      isVisitorProfile: req.isVisitorProfile,
      counts:{
        postCount: req.postCount,
        followerCount: req.followerCount,
        followingCount: req.followingCount
      }
    })
  } catch {
    res.render('404');
  }
  
};

exports.profileFollowingScreen =async function(req, res){

  try{
    let following = await Follow.getFollowingById(req.profileUser._id);
    res.render('profile-following', {
      currentPage:'following',
      following: following,
      profileUserName: req.profileUser.username,
      profileAvatar: req.profileUser.avatar,
      isFollowing: req.isFollowing,
      isVisitorProfile: req.isVisitorProfile,
      counts:{
        postCount: req.postCount,
        followerCount: req.followerCount,
        followingCount: req.followingCount
      }
    })
  } catch {
    res.render('404');
  }
  
};
