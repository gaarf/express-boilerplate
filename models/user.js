var def = {
  name: 'User', // the name of the class
  table: 'Users', // db table

  idField: 'id', // autoincrement id field
  fields: [ // all other fields
    'password',
    'firstName',
    'lastName'
  ],

  defaults: { // defaults for an unsaved instance
    firstName: 'Mysteriously',
    lastName: 'Unnamed'
  }
};

var secret = require('../etc/secrets.js').get('passwordHash'),
    crypto = require('crypto');
function hash(p,n) {
  return crypto.createHmac('sha256', secret).update(p).update(n).digest('hex');
}

module.exports.def = def;
module.exports.get = require('../lib/model.js').create(def, {

  getName: function() {
    return this.firstName + ' ' + this.lastName;
  },

  setPassword: function(pass) {
    var nonce = crypto.createHash('md5').update(Math.random().toString()).digest('hex');
    this.password = nonce + '.' + hash(pass, nonce);
  },

  checkPassword: function(pass) {
    var s = this.password.split('.');
    return hash(pass, s[0]) == s[1];
  }

});

