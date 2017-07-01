'use strict'
const User = use('App/Model/User')
const Movie = use('App/Model/Movie')
const dbUtils = use('App/neo4j/dbUtils')
class UserController {
  * login(request, response) {
    var b = request.only('user', 'pass');
    console.log(b);
    try {
      const user = yield User.login(dbUtils.getSession(request), b.user, b.pass);
     yield  request.session.put('api_key',user.token);
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
  * befriend(request, response) {
    let userId = request.param('id');
    let myId = request.user.id;
    yield User.befriend(myId,userId);
    yield response.redirect('/friends')
    // yield response.sendView('login', {})

  }
  * addMovie(request , response)
  {
    const id = request.param('id');
    console.log(request.user.id);
    let movie  = yield User.addMovie(request.user.id,id);
    yield response.redirect('/profile')
  }
  * profile(request , response)
  {
    const id = request.user.id;

    // console.log(request.user.id);
    // let movie  = yield User.addMovie(id,request.user.id);
    let watched = yield User.myMovie(id);
    let rated = yield Movie.getRatedByUser(id);
    return yield response.sendView('user_profile', {user:request.user,watched:watched,rated:rated});
  }
  * myFriends(request, response)
  {
    let userId = request.user.id;
    try
    {
      console.log(userId)
      let users = yield User.friends(userId);
      console.log(users)
      return yield response.sendView('my-friends', {users:users});
    }catch (err)
    {
      console.log(err);
    }
    return yield response.sendView('login', {})
    // response.json(users);
  }

}

module.exports = UserController
