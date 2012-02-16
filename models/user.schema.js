module.exports.name = 'User';
module.exports.get = function(mongoose) {

  var UserSchema = new mongoose.Schema({

  }, { strict: true });

  // !!! everyauth adds a bunch of stuff laterz

  UserSchema
    .virtual('displayName')
    .get(function () {
      return this.twit.name || this.fb.name.full || this.login;
    });



  return UserSchema;
}