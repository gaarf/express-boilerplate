// some things are best left to .gitignore...
module.exports.getSecret = function(key) {
  return SECRETS[key];
};

var SECRETS = 
      {

        foo: "bar"
      , baz: "bat"


      }

