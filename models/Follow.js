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
Follow.prototype.validate = async function(action){
  let followedAccount = await usersCollection.findOne({username: this.followedUserName});
  if(followedAccount){
    this.followedId = followedAccount._id;
  } else {
    this.errors.push('You can not follow a user that does not exist.')
  }
  
  let doesFollowAlreadyExist = await followCollection.findOne({
    followedId: this.followedId,
    authorId: new ObjectID(this.authorId)
  });
  
  if(action == 'create'){
    if(doesFollowAlreadyExist){
      this.errors.push('You are already following this user.')
    }
  }
  if(action == 'delete'){
    if(!doesFollowAlreadyExist){
      this.errors.push('You can not stop  following someone you do not already follow.')
    }
  }
  
  if(this.followedId.equals(this.authorId)){
    this.errors.push("You can not follow yourself.")
  }
};

Follow.prototype.create = function(){
  return new Promise(async (resolve, reject) => {
    this.cleanUp();
    await this.validate('create');
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

Follow.prototype.delete = function(){
  return new Promise(async (resolve, reject) => {
    this.cleanUp();
    await this.validate('delete');
    if(!this.errors.length){
      await followCollection.deleteOne({
        followedId:this.followedId,
        authorId: new ObjectID(this.authorId)
      });
      resolve();
    } else {
      reject(this.errors);
    }
  })
};


Follow.isVisitorFollowing = async function(followedId, visitorId){
  let followDoc =await followCollection.findOne({followedId: followedId, authorId: new ObjectID(visitorId)});
  if(followDoc){
    return true;
  } else {
    return false;
  }
};
module.exports = Follow;
