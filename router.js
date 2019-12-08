// console.log('I am executed immediately.');
// module.exports = 'I am the export for the router file';

const express = require('express');
const router = express.Router();

const userController = require('./controllers/userController');

const postController = require('./controllers/postController.js');


// user related routes
router.get('/', userController.home);

router.post('/register', userController.register);

router.post('/login', userController.login);

router.post('/logout', userController.logout);

// post related routes
router.get('/create-post', userController.mustBeLoggedIn, postController.viewCreateScreen);

router.post('/create-post', userController.mustBeLoggedIn, postController.createPost);

router.get('/post/:id', postController.viewSingle);

router.get('/post/:id/edit', postController.viewEditScreen);
router.post('/post/:id/edit', postController.edit);



// profile related routes
router.get('/profile/:username',userController.ifUserExists, userController.profilePostsScreen);



// router.get('/', function(req, res) {
//   res.render('home-guest');
// });

// router.get('/about', function(req, res) {
//   res.send('This is About page!')
// });

// router.post('/create-post', postController.create);
// router.post('/login', userController.login);


module.exports = router;

