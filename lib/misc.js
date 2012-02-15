var _ = require('underscore');

module.exports.parallelize = function(calls, cb, data) {
  cb = cb || console.log;
  data = data || {};
  var context = this,
      afterAll = _.after( _.size(calls), function() { cb(data); } );
  _.forEach(calls, function(method, key) {
    method.call(context, function() {
      data[key] = arguments.length>1 ? Array.apply(null, arguments) : arguments[0];
      afterAll(data);
    });
  });
}


module.exports.parsePerson = function(person) {
  if (typeof person !== "string") return person;
  var name = person.match(/^([^\(<]+)/)
    , url = person.match(/\(([^\)]+)\)/)
    , email = person.match(/<([^>]+)>/)
    , obj = {};
  if (name && name[0].trim()) obj.name = name[0].trim();
  if (email) obj.email = email[1];
  if (url) obj.url = url[1];
  return obj;
}