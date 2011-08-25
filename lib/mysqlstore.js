/**
 * Return an instance of a `MysqlStore` extending `connect`'s session Store.
 * should be replaced with somethin like redis or memcached for speeeeeeeed
 *
 * @param {object} connect (or express)
 * @param {object} dbClient (or pool)
 * @return {Function}
 * @api public
 */

module.exports.create = function(connect, dbClient, tableName){

  /**
   * Database config
   */

  tableName = tableName || 'Sessions';

  dbClient.query('CREATE TABLE IF NOT EXISTS ' + tableName +
      ' (sid VARCHAR(64), sess LONGTEXT, expiresAt DATETIME, PRIMARY KEY (`sid`));');

  function dbSid(sid) {
    return sid.toString().replace(/\W/g, '').substr(0,64);
  }

  if(process.env['NODE_ENV']=='production') {
    setInterval(function() {
      dbClient.query('DELETE FROM '+tableName+' WHERE expiresAt<NOW();');
    }, 1000 * 60 * 60); // every hour
  }

  /**
   * Connect's Store.
   */

  var Store = connect.session.Store;

  /**
   * Initialize MysqlStore with the given `options`.
   *
   * @param {Object} options
   * @api public
   */

  function MysqlStore(options) {
    options = options || {};
    Store.call(this, options);
  };

  /**
   * Inherit from `Store`.
   */

  MysqlStore.prototype.__proto__ = Store.prototype;

  /**
   * Attempt to fetch session by the given `sid`.
   *
   * @param {String} sid
   * @param {Function} fn
   * @api public
   */

  MysqlStore.prototype.get = function(sid, fn){
    fn = fn || console.log;
    var self = this;
    dbClient.querySingle(
      'SELECT sess FROM '+tableName+' WHERE sid = ?;',
      [ dbSid(sid) ],
      function(err, res) {
        if (!res) {
          return fn();
        }
        try {
          var sess = JSON.parse(res.sess.toString());
        }
        catch (err) {
          fn(err);
        }
        var expires = false;
        if(sess.cookie) {
          expires = 'string' == typeof sess.cookie.expires
                  ? new Date(sess.cookie.expires)
                  : sess.cookie.expires;
        }
        if (!expires || new Date < expires) {
          fn(null, sess);
        }
        else {
          self.destroy(sid, fn);
        }
      }
    );
  };

  /**
   * Commit the given `sess` object associated with the given `sid`.
   *
   * @param {String} sid
   * @param {Session} sess
   * @param {Function} fn
   * @api public
   */

  MysqlStore.prototype.set = function(sid, sess, fn){
    fn = fn || console.log;
    var data = JSON.stringify(sess);
    if(sess.cookie && sess.cookie.expires) {
      var exp = Math.floor((new Date(sess.cookie.expires)).getTime() / 1000 );
      dbClient.querySingle(
        'INSERT INTO '+tableName+' (sid, sess, expiresAt) VALUES (?, ?, FROM_UNIXTIME(?)) '
             + 'ON DUPLICATE KEY UPDATE sess = ?, expiresAt = FROM_UNIXTIME(?);',
        [ dbSid(sid), data, exp, data, exp ],
        fn
      );
    }
    else { // forever storage
      dbClient.querySingle(
        'INSERT INTO '+tableName+' (sid, sess) VALUES (?, ?) '
             + 'ON DUPLICATE KEY UPDATE sess = ?;',
        [ dbSid(sid), data, data ],
        fn
      );
    }
  };

  /**
   * Destroy the session associated with the given `sid`.
   *
   * @param {String} sid
   * @api public
   */

  MysqlStore.prototype.destroy = function(sid, fn){
    fn = fn || console.log;
    dbClient.querySingle(
      'DELETE FROM '+tableName+' WHERE sid = ?;',
      [ dbSid(sid) ],
      fn
    );
  };

  /**
   * Fetch number of sessions.
   *
   * @param {Function} fn
   * @api public
   */

  MysqlStore.prototype.length = function(fn){
    fn = fn || console.log;
    dbClient.querySingle(
      'SELECT COUNT(sid) AS count FROM '+tableName+';',
      [],
      function(err, res) {
        fn(err, res && res.count);
      }
    );
  };

  /**
   * Clear all sessions.
   *
   * @param {Function} fn
   * @api public
   */

  MysqlStore.prototype.clear = function(fn){
    fn = fn || console.log;
    dbClient.querySingle(
      'TRUNCATE '+tableName+';',
      [],
      fn
    );
  };

  return new MysqlStore();
};
