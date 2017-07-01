'use strict'

/*
|--------------------------------------------------------------------------
| Router
|--------------------------------------------------------------------------
|
| AdonisJs Router helps you in defining urls and their actions. It supports
| all major HTTP conventions to keep your routes file descriptive and
| clean.
|
| @example
| Route.get('/user', 'UserController.index')
| Route.post('/user', 'UserController.store')
| Route.resource('user', 'UserController')
*/

const Route = use('Route')

Route.on('/').render('welcome')
Route.on('login').render('login')
Route.post('login', 'UserController.login')
Route.on('register').render('register')
Route.on('news').render('news')
Route.post('register', 'UserController.register')

Route.get('/movies', 'MovieController.list');
// Route.get('/movies/:id', 'MovieController.detail');
Route.get('/users', 'UserController.index');

//Product
Route.group('auth-routes',() =>
{
  Route.get('logout', 'UserController.logout');
  Route.on('/product/add').render('add-edit-product');
  Route.post('/product/add', 'ProductController.add');
  Route.get('/product/','ProductController.index');
  Route.get('/product/delete/:id','ProductController.delete');
  Route.get('/movies/:id', 'MovieController.detail');
  Route.post('/movies/:id/rate', 'MovieController.rate');
  Route.get('/movies/:id/add', 'UserController.addMovie');
  Route.get('/users/:id/add', 'UserController.befriend');
  Route.get('/friends', 'UserController.myFriends');
  Route.get('/profile', 'UserController.profile');
}).middleware('myAuth');

