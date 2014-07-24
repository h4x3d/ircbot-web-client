'use strict';

require('angular');

angular.module('config', ['restangular'])
.service('Config', ['Restangular', function(Restangular) {
  return Restangular.one('configs', 'current');
}]);
