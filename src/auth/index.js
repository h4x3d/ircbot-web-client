'use strict';

require('restangular');
require('../user');
require('../store');

angular.module('auth', ['user', 'store'])
.service('Auth', ['Restangular', 'User', '$http', 'Store', function(Restangular, User, $http, Store) {

  var authed = false,
    token = Store.get('webtoken');

  function isAuthed() {
    return authed;
  }

  function getToken() {
    return token;
  }

  if(token) {
    $http.defaults.headers.common.Authorization = 'Bearer ' + token;
  }

  function authenticate(username, password) {
    return Restangular.all('login').post({
      username: username,
      password: password
    }).then(function(data) {
      token = data.token;
      Store.set('webtoken', token);
      $http.defaults.headers.common.Authorization = 'Bearer ' + token;
      authed = true;
    });
  }

  function checkAuth() {
    return User.get().then(function() {
      authed = true;
    }, function() {
      authed = false;
    });
  }

  return {
    isAuthed: isAuthed,
    authenticate: authenticate,
    checkAuth: checkAuth,
    getToken: getToken
  };
}]);
