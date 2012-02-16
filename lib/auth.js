// cf https://github.com/bnoguchi/mongoose-auth

module.exports.config = function(kit, schema, mongooseAuth) {

  var conf = kit.secrets.get('everyAuth');

  schema.plugin(mongooseAuth, {

      everymodule: {
          everyauth: {
              User: function () {
                return kit.model.User;
              }

            , moduleErrback: function(err, data) {
                console.error('moduleErrback log>throw', err);
                if(data && data.res) { // see https://github.com/bnoguchi/everyauth/issues/36
                  data.req.logout();
                  kit.middleware.badRequest(null, data.res);
                }
              }

          }
      }

    , password: {
          extraParams: {
            //   phone: String
            // , name: {
            //       first: String
            //     , last: String
            //   }
          }

        , everyauth: {
              getLoginPath: '/login'
            , postLoginPath: '/login'
            , loginView: 'misc/login'
            , getRegisterPath: '/register'
            , postRegisterPath: '/register'
            , registerView: 'misc/register'
            , loginSuccessRedirect: '/'
            , registerSuccessRedirect: '/'
          }
      }

    , facebook: {
        everyauth: {
            myHostname: 'http://local.host:3000'
          , appId: conf.fb.appId
          , appSecret: conf.fb.appSecret
          , redirectPath: '/'
        }
      }

    , twitter: {
        everyauth: {
            myHostname: 'http://local.host:3000'
          , consumerKey: conf.twit.consumerKey
          , consumerSecret: conf.twit.consumerSecret
          , redirectPath: '/'
        }
      }

  });

}

