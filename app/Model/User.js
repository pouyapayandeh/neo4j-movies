"use strict"

var uuid = require('node-uuid');
var randomstring = require("randomstring");
var _ = require('lodash');
var dbUtils = require('../neo4j/dbUtils');
var crypto = require('crypto');
var md5 = require('md5');

function hashPassword(username, password) {
  var s = username + ':' + password;
  return crypto.createHash('sha256').update(s).digest('hex');
}
class User {

  constructor(_node)
  {
    var username = _node.properties['username'];
    _.extend(this, {
      'id': _node.properties['id'],
      'username': username,
      'avatar': {
        'full_size': 'https://www.gravatar.com/avatar/' + md5(username) + '?d=retro'
      }
    });
  }
  static register(session, username, password) {
    return session.run('MATCH (user:User {username: {username}}) RETURN user', {username: username})
      .then(results => {
        if (!_.isEmpty(results.records)) {
          throw {username: 'username already in use', status: 400}
        }
        else {
          return session.run('CREATE (user:User {id: {id}, username: {username}, password: {password}, api_key: {api_key}}) RETURN user',
            {
              id: uuid.v4(),
              username: username,
              password: hashPassword(username, password),
              api_key: randomstring.generate({
                length: 20,
                charset: 'hex'
              })
            }
          ).then(results => {
              return new User(results.records[0].get('user'));
            }
          )
        }
      });
  };

  static me(session, apiKey) {
    return session.run('MATCH (user:User {api_key: {api_key}}) RETURN user', {api_key: apiKey})
      .then(results => {
        if (_.isEmpty(results.records)) {
          throw {message: 'invalid authorization key', status: 401};
        }
        return new User(results.records[0].get('user'));
      });
  };

  static login(session, username, password) {
    return session.run('MATCH (user:User {username: {username}}) RETURN user', {username: username})
      .then(results => {
          if (_.isEmpty(results.records)) {
            throw {username: 'username does not exist', status: 400}
          }
          else {
            var dbUser = _.get(results.records[0].get('user'), 'properties');
            if (dbUser.password != hashPassword(username, password)) {
              throw {password: 'wrong password', status: 400}
            }
            return {token: _.get(dbUser, 'api_key')};
          }
        }
      );
  };



}

module.exports = User
