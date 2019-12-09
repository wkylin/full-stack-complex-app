const usersCollection = require('../db').db().collection('users');
const followCollection = require('../db').db().collection('follows');
const ObjectID = require('mongodb').ObjectID;

let Follow = function(followedUserName, authorId){
  this.followedUserName = followedUserName;
  this.authorId = authorId;
  this.errors = [];
};


Follow.prototype.cleanUp = function(){
  if(typeof(this.followedUserName) != 'string'){
    this.followedUserName = '';
  }
};
Follow.prototype.validate = async function(){
  let followedAccount = await usersCollection.findOne({username: this.followedUserName});
  if(followedAccount){
    this.followedId = followedAccount._id;
  } else {
    this.errors.push('You can not follow a user that does not exist.')
  }
};
Follow.prototype.create = function(){
  return new Promise(async (resolve, reject) => {
    this.cleanUp();
    await this.validate();
    if(!this.errors.length){
      await followCollection.insertOne({
        followedId:this.followedId,
        authorId: new ObjectID(this.authorId)
      });
      resolve();
    } else {
      reject(this.errors);
    }
  })
};

module.exports = Follow;
