'use strict'
const User = use('App/Model/User')
class UserAuth {

  * handle (request, response, next) {
    // here goes your middleware logic
    // yield next to pass the request to next middleware or controller
    const key = yield request.session.get('api_key');
    if(key == null)
    {
      response.status(401).send('Invalid credentials');
      return ;
    }else
      var user = User.me(key);
      request.user =user;
      yield next
  }

}

module.exports = UserAuth;
