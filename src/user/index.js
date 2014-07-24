'use strict';

angular.module('user', ['restangular'])
.service('User', ['Restangular', function(Restangular) {
  return Restangular.one('users', 'me');
}]);
