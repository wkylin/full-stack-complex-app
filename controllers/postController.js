const Post = require('../models/Post');

exports.viewCreateScreen = function (req, res) {
  res.render('create-post');
  // res.render('create-post',{
  //   username:req.session.user.username,
  //   avatar: req.session.user.avatar,
  // });
};

exports.createPost = function (req, res) {
  // console.log(req.session.user);
  let post = new Post(req.body, req.session.user._id );
  post.create().then(function () {
    res.send('New post created.');
  }).catch(function (errors) {
    res.send(errors);
  });
};

exports.viewSingle = async function(req, res){
  try {
    let post = await Post.findSingleById(req.params.id);
    console.log('post', post);
    res.render('single-post-screen', { post: post});
  } catch {
    res.send('404 template will go here.')
  }
};


