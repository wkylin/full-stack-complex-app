const validator = require('validator');

let User = function (data) {
  this.data = data;
  this.errors = [];
};

User.prototype.validate = function () {
  console.log(this.data.username);
  if (this.data.username ===   '') {
    this.errors.push('You must provide a username.')
  }
  if(this.data.username !=  '' &&  !validator.isAlphanumeric(this.data.username)) {
    this.errors.push('Username can only contain letters and numbers.')
  }
  if (!validator.isEmail(this.data.email)) {
    this.errors.push('You must provide a valid email address.')
  }
  if (this.data.password ===   '') {
    this.errors.push('You must provide a password.')
  }
  
  if(this.data.password.length > 0 &&  this.data.password.length < 12) {
    this.errors.push('Password must be at least 12 characters.')
  }
  
  if(this.data.password.length > 100){
    this.errors.push('Password cannot exceed 100 characters.')
  }
  
  
};

User.prototype.register = function () {
  console.log('register');
  // Step #1 : Validate user data
  this.validate();
  
  
  // Step #2: Only if there are no validation errors
  // then save the user data into a database
  
};

module.exports = User;
