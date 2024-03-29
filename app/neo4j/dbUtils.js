"use strict";

// neo4j cypher helper module
var config = {
  'USERNAME': 'neo4j',
  'PASSWORD' : '123',
  'neo4j': 'local',
  'neo4j-local': 'bolt://localhost:7687',
  'neo4j-remote': 'bolt:http://162.243.100.222:7687',
}
var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver(config['neo4j-local'], neo4j.auth.basic(config['USERNAME'], config['PASSWORD']));

// if (nconf.get('neo4j') == 'remote') {
//   driver = neo4j.driver(nconf.get('neo4j-remote'), neo4j.auth.basic(nconf.get('USERNAME'), nconf.get('PASSWORD')));
// }

exports.getSession = function (context) {
  if(context.neo4jSession) {
    return context.neo4jSession;
  }
  else {
    context.neo4jSession = driver.session();
    return context.neo4jSession;
  }
};

exports.getSession = function () {
    return driver.session();
};

exports.dbWhere = function (name, keys) {
  if (_.isArray(name)) {
    _.map(name, (obj) => {
      return _whereTemplate(obj.name, obj.key, obj.paramKey);
    });
  } else if (keys && keys.length) {
    return 'WHERE ' + _.map(keys, (key) => {
        return _whereTemplate(name, key);
      }).join(' AND ');
  }
};

function whereTemplate(name, key, paramKey) {
  return name + '.' + key + '={' + (paramKey || key) + '}';
}
