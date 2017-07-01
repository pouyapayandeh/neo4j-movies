'use strict'
const User = use('App/Model/User')
const dbUtils = use('App/neo4j/dbUtils')
class UserController {
  * login(request, response) {
    var b = request.only('user', 'pass');
    console.log(b);
    try {
      const user = yield User.login(dbUtils.getSession(request), b.user, b.pass);
      request.session.put('api_key',user.token);
      console.log(user);
    } catch (e) {
      response.status(400).send('Invalid credentials');
      return;
    }
    yield response.sendView('login', {})

    return;

  }

  * register(request, response) {
    let data = request.only('user', 'pass', 'type');
    console.log(data);
    try {
      const user = yield User.register(dbUtils.getSession(request), data.user, data.pass);
      console.log(user);
    } catch (e) {
      console.log(e);
    }
    yield response.sendView('login', {})

  }

  *logout(request, response) {
    yield request.session.forget('api_key');
    yield response.redirect('login')
  }
  * index(request, response)
  {
    let users = yield User.allUser();
    yield response.sendView('add-friend', {users:users});
    // response.json(users);
  }
}

module.exports = UserController
