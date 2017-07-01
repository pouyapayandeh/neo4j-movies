/**
 * Created by Pouya Payandeh on 7/1/2017.
 */
'use strict'
const Movie = use('App/Model/Movie')
const dbUtils = use('App/neo4j/dbUtils')
class MovieController {
  * list(request, response) {
    const data = request.only('title');
    if(data.title)
    {
      return yield this.search(request,response);
    }
      let movies = yield Movie.getAll(dbUtils.getSession(request));
    yield response.sendView('index', {movies:movies});
    //   response.json(movies[0])
  }

  * detail(request , response)
  {
    const id = request.param('id');
    let movie  = yield Movie.getById(dbUtils.getSession(request),id,0);
    yield response.sendView('details', {movie:movie});
  }
  * search(request , response)
  {
    const data = request.only('title');
    let movies  = yield Movie.getByName(data.title);
    response.json(movies)
    // yield response.sendView('details', {movie:movie});
  }
  //
  // * register(request, response) {
  //   let data = request.only('user', 'pass', 'type');
  //   console.log(data);
  //   try {
  //     const user = yield User.register(dbUtils.getSession(request), data.user, data.pass);
  //     console.log(user);
  //   } catch (e) {
  //     console.log(e);
  //   }
  //   yield response.sendView('login', {})
  //
  // }
  //
  // *logout(request, response) {
  //   yield request.session.forget('role');
  //   yield response.redirect('login')
  //
  // }
}

module.exports = MovieController
