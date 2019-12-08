const Post = require('../models/Post');

exports.viewCreateScreen = function (req, res) {
  res.render('create-post');
  // res.render('create-post',{
  //   username:req.session.user.username,
  //   avatar: req.session.user.avatar,
  // });
};

exports.createPost = function (req, res) {
  let post = new Post(req.body);
  post.create().then(function () {
    res.send('New post created.');
  }).catch(function (errors) {
    res.send(errors);
  });
};
