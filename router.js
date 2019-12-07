// console.log('I am executed immediately.');
// module.exports = 'I am the export for the router file';

const express = require('express');
const router = express.Router();

const userController = require('./controllers/userController')

router.get('/', userController.home);

router.post('/register', userController.register);

router.post('/login', userController.login);

router.post('/logout', userController.logout);




// router.get('/', function(req, res) {
//   res.render('home-guest');
// });

// router.get('/about', function(req, res) {
//   res.send('This is About page!')
// });

// router.post('/create-post', postController.create);
// router.post('/login', userController.login);


module.exports = router;

