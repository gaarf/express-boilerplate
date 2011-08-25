// some things are best left to .gitignore...
module.exports.get = function(key) {
  return SECRETS[key];
};

var SECRETS = 
      {

        sessionHash: "Lorem ipsum dolor sit amet",
        passwordHash: "mollit anim id est laborum"


      }

