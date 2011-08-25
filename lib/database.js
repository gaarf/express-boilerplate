// based off of https://github.com/jhurliman/node-mysql-simple

var poolModule = require('generic-pool');
var mysql = require('mysql');

var pool = null;

var VERBOSE = true; // process.env['NODE_ENV']!='production';

function now() {
  return new Date();
}

function logSince(when, query) {
  if(when) {
    var ms = now() - when;
    var desc = query.split(' ').splice(0,4).join(' ')+"...";
    console.log("[db] "+ms+"ms / "+desc);
  }
}

/**
 * Initialize the MySQL connection pool with the given database details.
 */
exports.init = function(dbUser, dbPass, dbDatabase, dbHost, dbPort) {
  pool = poolModule.Pool({
    name: 'mysql',
    create: function(callback) {
      var c = mysql.createClient();
      if (dbUser) c.user = dbUser;
      if (dbPass) c.password = dbPass;
      if (dbDatabase) c.database = dbDatabase;
      if (dbHost) c.host = dbHost;
      if (dbPort) c.port = dbPort;
      callback(c);
    },
    destroy: function(client) {
      if (client.connected) {
        try { client.end(); }
        catch (err) { console.error('Failed to close MySQL connection: ' + err); }
      }
    },
    max: 25,
    idleTimeoutMillis: 2222,
    log: false
  });
};


/**
 * Execute a query that is expected to return zero or more rows.
 * @param {string} query SQL query to execute
 * @param {Array.<Object>} data Parameters to substitute into the query
 * @param {function(string, Array.<Object>)} callback Callback to execute when
 *        the query completes
 */
exports.query = function(query, data, callback) {
  var start = VERBOSE && now();
  pool.acquire(function(client) {
    client.query(query, data||[], function(err, results, fields) {
      try { 
        callback && callback(err, results); 
      } finally { 
        logSince(start, query);
        pool.release(client);
      }
    });
  });
};

/**
 * Execute a query that is expected to return zero or one rows.
 */
exports.querySingle = function(query, data, callback) {
  var start = VERBOSE && now();
  pool.acquire(function(client) {
    client.query(query, data||[], function(err, results, fields) {
      try {
        if (!err && results && results.length > 0) {
          callback && callback(null, results[0]);
        } else {
          callback && callback(err, null);
        }
      } finally {
        logSince(start, query);
        pool.release(client);
      }
    });
  });
};

/**
 * Execute a query that is expected to return many rows, and stream the results
 * back one row at a time.
 */
exports.queryMany = function(query, data, rowCallback, endCallback) {
  var start = VERBOSE && now();
  pool.acquire(function(client) {
    client.query(query, data||[])
      .on('error', function(err) {
        try {
          endCallback && endCallback(err);
        } finally {
          pool.release(client);
        }
      })
      .on('row', rowCallback)
      .on('end', function() {
        try {
          endCallback && endCallback(null);
        } finally {
          logSince(start, query);
          pool.release(client);
        }
      });
  });
};



