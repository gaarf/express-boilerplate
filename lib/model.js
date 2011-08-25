var _ = require('underscore'),
    util = require('util'),
    events = require('events');

module.exports.create = function(def, instanceMethods) {
  def.idField = def.idField || 'id';
  return function(app) { 
    var dbClient = app.STUFF.dbClient,
        FIELDS = _.union(def.fields, [
          'createdAt',
          'updatedAt'
        ], [def.idField]);

    function Model(props) {
      var self = this,
          props = props || {};
      FIELDS.forEach(function(f){
        self[f] = props[f] || null;
      });
      events.EventEmitter.call(this);
      return _(this).defaults(def.defaults);
    };

    util.inherits(Model, events.EventEmitter);

    /*
      Instance methods
    */
    _.extend(Model.prototype, {

      hasField: function(name) {
        return _.include(FIELDS, name);
      },

      getId: function() {
        return this[def.idField];
      },

      destroy: function() {
        var id = this.getId();
        if(id) {
          var that = this;
          dbClient.querySingle('DELETE FROM '+def.table+' WHERE '+def.idField+' = ?;', [id], function(err, res) {
            if(err) {
              throw err;
            }
            else {
              that[def.idField] = null;
              that.emit('destroyed');
            }
          });
        }
      },

      save: function() {
        var that = this,
            id = this.getId(),
            now = Math.floor((new Date()).getTime()/1000),
            qs = [],
            data = [];

        this.updatedAt = now;
        if(!id) {
          this.createdAt = now;
        }

        FIELDS.forEach(function(f){
          var d = that[f];
          if(f!=def.idField && !_.isNull(d)) {
            data.push(d);
            qs.push(f+' = ?');
          }
        });

        var set = def.table+' SET '+qs.join(', ');

        if(id) {
          var sql = 'UPDATE '+set+' WHERE '+def.idField+' = ?;';
          data.push(id);
        }
        else {
          var sql = 'INSERT INTO '+set+';';
        }
        dbClient.query(sql, data, function(err, res) {
          if(err) {
            throw err;
          }
          else {
            if(res.insertId) {
              that[def.idField] = res.insertId;
            }
            that.emit('saved');
          }
        });
      },

    }, instanceMethods || {});


    /*
      Static class methods
    */
    _.extend(Model, {

      findById: function(id, cb) {
        cb = cb || console.log;
        this.findAllWhere(def.idField+'=?', id, function(res) {
          cb(_.first(res));
        });
      },

      findAllWhere: function(where, value, cb) {
        var out = [];
        cb = cb || console.log;
        dbClient.queryMany(
          'SELECT * from '+def.table+' WHERE '+where+';',
          _.isArray(value) ? value : [value],
          function(row) {
            out.push(new app.STUFF.model[def.name](row));
          },
          function(err) {
            if(err) {
              throw err;
            }
            else {
              cb(out);
            }
          }
        );
      }

    });

    return Model;
  }
}
