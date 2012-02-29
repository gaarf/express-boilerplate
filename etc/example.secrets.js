// rename this, edit, be sure to add it to .gitignore

module.exports.get = function(key) {
  return SECRETS[key];
};

var SECRETS = {

  sessionHash: 'HELLOWORLD',

  mongoUrls: {
    data: 'mongodb://localhost/',
    sess: 'mongodb://localhost/boilerplate-sessions'
  },

  everyAuth: {
      fb: {
          appId: '111565172259433'
        , appSecret: '85f7e0a0cc804886180b887c1f04a3c1'
      }
    , twit: {
          consumerKey: 'JLCGyLzuOK1BjnKPKGyQ'
        , consumerSecret: 'GNqKfPqtzOcsCtFbGTMqinoATHvBcy1nzCTimeA9M0'
      }
  }

}

