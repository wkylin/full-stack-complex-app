const usersCollection = require('../db').db().collection('users');
const followCollection = require('../db').db().collection('follows');
const ObjectID = require('mongodb').ObjectID;
const User = require('./User.js');

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

Follow.getFollowersById = function(id){
  return new Promise(async (resolve, reject) => {
    try{
      let followers = await followCollection.aggregate([
        {$match: {followedId: id}},
        {$lookup: {from: 'users', localField:'authorId', foreignField: '_id', as: 'userDoc'}},
        {$project:{
          username: {$arrayElemAt:['$userDoc.username', 0]},
          email: {$arrayElemAt:['$userDoc.email', 0]}
          }}
      ]).toArray();
      followers = followers.map(function(follower){
        // create a user
        let user = new User(follower, true);
        return {
          username: follower.username,
          avatar: user.avatar
        }
      });
      resolve(followers);
    } catch {
      reject()
    }
  })
};

Follow.getFollowingById = function(id){
  return new Promise(async (resolve, reject) => {
    try{
      let following = await followCollection.aggregate([
        {$match: {authorId: id}},
        {$lookup: {from: 'users', localField:'followedId', foreignField: '_id', as: 'userDoc'}},
        {$project:{
          username: {$arrayElemAt:['$userDoc.username', 0]},
          email: {$arrayElemAt:['$userDoc.email', 0]}
          }}
      ]).toArray();
      following = following.map(function(follower){
        // create a user
        let user = new User(follower, true);
        return {
          username: follower.username,
          avatar: user.avatar
        }
      });
      resolve(following);
    } catch {
      reject()
    }
  })
};

Follow.countFollowersById = function(id){
  return new Promise(async (resolve, reject) => {
    let followerCount = await followCollection.countDocuments({followedId: id});
    resolve(followerCount);
  })
};

Follow.countFollowingById = function(id){
  return new Promise(async (resolve, reject) => {
    let followingCount = await followCollection.countDocuments({authorId: id});
    resolve(followingCount);
  })
};


module.exports = Follow;
