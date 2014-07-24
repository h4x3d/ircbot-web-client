'use strict';

require('angular');
require('angular-route');

require('../auth');
require('../irc');

angular
.module('chat', ['ngRoute', 'http-auth-interceptor', 'auth', 'irc'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider
   .when('/', {
    templateUrl: 'chat/index.html',
    controller: ['$scope', 'irc', function($scope, irc) {
      $scope.messages = [];

      irc.on('authenticated', function() {
        console.log('authenticated');
      });

      irc.on('data', function(message) {
        $scope.messages.push(message);
      });
    }]
   });
}]);
