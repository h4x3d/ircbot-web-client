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
.directive('focusWhen', require('./directives/focus-when'))
.config(['$routeProvider', '$locationProvider', 'RestangularProvider', '$httpProvider', function($routeProvider, $locationProvider, RestangularProvider, $httpProvider) {

  $httpProvider.defaults.useXDomain = true;

  var production = process.env.NODE_ENV === 'production';
  var address = production ? '/api' : 'http://localhost:9001/api';

  RestangularProvider.setRestangularFields({id: '_id'});
  RestangularProvider.setBaseUrl(address);

}]).controller('MainController', ['$rootScope', '$scope', 'authService', 'Auth', function($rootScope, $scope, authService, Auth) {

  $scope.visible = false;
  $scope.focusTo = null;
  $scope.errorMessage = null;

  $rootScope.$on('event:auth-loginRequired', function() {
    $scope.visible = true;
  });

  $rootScope.$on('event:auth-loginConfirmed', function() {
    $scope.visible = false;
  });

  $scope.submit = function() {
    if(!($scope.username && $scope.password)) {
      return;
    }

    $scope.errorMessage = null;
    $scope.focusTo = null;

    Auth.authenticate($scope.username, $scope.password)
    .then(authService.loginConfirmed, function(err) {

      $scope.errorMessage = err.data;

      var message = err.data.toLowerCase();

      if(message.indexOf('username') > -1) {
        $scope.username = null;
        $scope.focusTo = 'username';
      }

      if(message.indexOf('password') > -1) {
        $scope.password = null;
        $scope.focusTo = 'password';
      }

    });
  };

}]);
