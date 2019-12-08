const usersCollection = require('../db').db().collection('users');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const md5 = require('md5');

let User = function (data) {
  this.data = data;
  this.errors = [];
};

User.prototype.cleanUp = function () {
  if (typeof (this.data.username) != 'string') {
    this.data.username = '';
  }
  if (typeof (this.data.email) != 'string') {
    this.data.email = '';
  }
  if (typeof (this.data.password) != 'string') {
    this.data.password = '';
  }
  
  this.data = {
    username: this.data.username.trim().toLowerCase(),
    email: this.data.email.trim().toLowerCase(),
    password: this.data.password
  };
};

User.prototype.validate = function () {
  return new Promise(async (resolve, reject) => {
    
    // console.log(this.data.username);
    if (this.data.username === '') {
      this.errors.push('You must provide a username.');
    }
    if (this.data.username != '' && !validator.isAlphanumeric(this.data.username)) {
      this.errors.push('Username can only contain letters and numbers.');
    }
    if (!validator.isEmail(this.data.email)) {
      this.errors.push('You must provide a valid email address.');
    }
    if (this.data.password === '') {
      this.errors.push('You must provide a password.');
    }
    
    if (this.data.password.length > 0 && this.data.password.length < 12) {
      this.errors.push('Password must be at least 12 characters.');
    }
    
    if (this.data.password.length > 100) {
      this.errors.push('Password cannot exceed 100 characters.');
    }
    
    let userName = this.data.username;
    let email = this.data.email;
    
    if (userName.length > 2 && userName.length < 31 && validator.isAlphanumeric(userName)) {
      let userNameExists = await usersCollection.findOne({ username: userName });
      if (userNameExists) {
        this.errors.push('That username is already taken');
      }
    }
    if (validator.isEmail(email)) {
      let emailExists = await usersCollection.findOne({ email: email });
      if (emailExists) {
        this.errors.push('That email is already being used.');
      }
    }
    resolve();
  });
};


// User.prototype.login = function(callback){
//   this.cleanUp();
//   usersCollection.findOne({username: this.data.username}, (err, attemptedUser) => {
//
//     console.log('attemptedUser', attemptedUser);
//     if(attemptedUser &&  attemptedUser.password ==  this.data.password){
//       callback('Congrats!!');
//     } else {
//       callback('Invalid name or password');
//     }
//   })
// };

// User.prototype.login = function () {
//   return new Promise((resolve, reject) => {
//       this.cleanUp();
//       usersCollection.findOne({ username: this.data.username }, (err, attemptedUser) => {
//
//         console.log('attemptedUser', attemptedUser);
//         if (attemptedUser && attemptedUser.password == this.data.password) {
//           resolve('Congrats!!');
//         } else {
//           reject('Invalid name or password');
//         }
//       });
//     }
//   );
// };

User.prototype.login = function () {
  return new Promise((resolve, reject) => {
      this.cleanUp();
      usersCollection.findOne({ username: this.data.username }).then((attemptedUser) => {
        console.log('attemptedUser', attemptedUser);
        if (attemptedUser && bcrypt.compareSync(this.data.password, attemptedUser.password)) {
          this.data = attemptedUser;
          this.getAvatar();
          resolve('Congrats!!');
        } else {
          reject('Invalid name or password');
        }
      }).catch(() => {
        reject('Please try again later.');
      });
    }
  );
};


User.prototype.register = function () {
  return new Promise(async (resolve, reject) => {
    // console.log('register');
    // Step #1 : Validate user data
    this.cleanUp();
    await this.validate();
    
    // Step #2: Only if there are no validation errors
    // then save the user data into a database
    
    if (!this.errors.length) {
      // hash user password
      let salt = bcrypt.genSaltSync(10);
      this.data.password = bcrypt.hashSync(this.data.password, salt);
      await usersCollection.insertOne(this.data);
      this.getAvatar();
      resolve();
    } else {
      reject(this.errors);
    }
  });
};


User.prototype.getAvatar = function(){
  this.avatar = `https://gravatar.com/avatar/${md5(this.data.email)}?s=128`
};

module.exports = User;
