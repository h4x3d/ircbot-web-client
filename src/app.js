'use strict';

require('angular');
require('angular-route');
require('restangular');
require('angular-http-auth');

angular.module('templates', []);
require('../tmp/templates.js');

require('./auth');
require('./irc');
require('./chat');

angular
.module('app', ['templates', 'ngRoute', 'restangular', 'http-auth-interceptor', 'auth', 'user', 'irc', 'chat'])
.config(['$routeProvider', '$locationProvider', 'RestangularProvider', '$httpProvider', function($routeProvider, $locationProvider, RestangularProvider, $httpProvider) {

  $httpProvider.defaults.useXDomain = true;

  RestangularProvider.setRestangularFields({id: '_id'});
  RestangularProvider.setBaseUrl('http://localhost:9001/api');

}]).controller('MainController', ['$rootScope', '$scope', 'authService', 'Auth', function($rootScope, $scope, authService, Auth) {

  $scope.visible = false;

  $rootScope.$on('event:auth-loginRequired', function() {
    $scope.visible = true;
  });

  $rootScope.$on('event:auth-loginConfirmed', function() {
    $scope.visible = false;
  });

  $scope.submit = function() {
    Auth.authenticate($scope.username, $scope.password)
    .then(authService.loginConfirmed, function(err) {
      console.log(err); // TODO
    });
  };

}]);
