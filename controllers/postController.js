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
  let post = new Post(req.body, req.session.user._id);
  post.create().then(function (newId) {
    req.flash('success', 'New post successfully created.');
    req.session.save(() =>  res.redirect(`/post/${newId}`));
    // res.send('New post created.');
  }).catch(function (errors) {
    // res.send(errors);
    errors.forEach(error =>  req.flash('errors', error));
    req.session.save(() =>  res.redirect('/create-post'));
  });
};

exports.viewSingle = async function (req, res) {
  try {
    let post = await Post.findSingleById(req.params.id, req.visitorId);
    // console.log('post', post);
    res.render('single-post-screen', { post: post });
  } catch {
    // res.send('404 template will go here.');
    res.render('404');
  }
};

exports.viewEditScreen = async function (req, res) {
  try {
    let post = await Post.findSingleById(req.params.id);
    // console.log('post>>>', post);
    
    if (post.authorId == req.visitorId) {
      res.render('edit-post', {
        post: post
      });
    } else {
      req.flash('errors', 'You do not have permission to perform that.');
      req.session.save(() => res.redirect('/'));
    }
    
  } catch {
    res.render('404');
  }
  
};

exports.edit = function (req, res) {
  let post = new Post(req.body, req.visitorId, req.params.id);
  post.update().then((status) => {
    if (status == 'success') {
      req.flash('success', 'Post successfully update.');
      req.session.save(function () {
        res.redirect(`/post/${req.params.id}/edit`);
      });
    } else {
      post.errors.forEach(function (error) {
        req.flash('errors', error);
      });
      req.session.save(function () {
        res.redirect(`/post/${req.params.id}/edit`);
      });
    }
  }).catch(() => {
    // a post with the requested id doesn't exist
    // or if the current visitor is not the owner of the requested post
    req.flash('errors', 'You do not have permission to perform that action.');
    req.session.save(function () {
      res.redirect('/');
    });
  });
};

