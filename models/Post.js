const postsCollection = require('../db').db().collection('posts');
const ObjectID = require('mongodb').ObjectID;

let Post = function (data, userId) {
  this.data = data;
  this.errors = [];
  this.userId = userId;
};

Post.prototype.cleanUp = function () {
  if (typeof (this.data.title) != 'string') {
    this.data.title = '';
  }
  if (typeof (this.data.body) != 'string') {
    this.data.body = '';
  }
  
  this.data = {
    title: this.data.title.trim(),
    body: this.data.body.trim(),
    createDate: new Date(),
    author: ObjectID(this.userId),
  };
};

Post.prototype.validate = function () {
  if (this.data.title == '') {
    this.errors.push('You must provide a title.');
  }
  if (this.data.body == '') {
    this.errors.push('You must provide post content.');
  }
};

Post.prototype.create = function () {
  return new Promise((resolve, reject) => {
    this.cleanUp();
    this.validate();
    if (!this.errors.length) {
      // save post into database
      postsCollection.insertOne(this.data).then(() => {
        resolve();
      }).catch(() => {
        this.errors.push('Please try again later.');
        reject(this.errors);
      });
    } else {
      reject(this.errors);
    }
  });
};

Post.findSingleById = function(id) {
  return new Promise( async function(resolve, reject) {
    if(typeof(id) !==   'string' ||  !ObjectID.isValid(id) ){
      reject();
      return;
    }
    let post = await postsCollection.findOne({_id: ObjectID(id)});
    if(post){
      resolve(post);
    } else {
      reject();
    }
  })
};

module.exports = Post;
