'use strict';

require('angular');
require('angular-route');
require('angular-moment');

require('../auth');
require('../irc');
require('../store');

angular
.module('chat', ['ngRoute', 'http-auth-interceptor', 'auth', 'irc', 'store', 'angularMoment'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider
   .when('/', {
    templateUrl: 'chat/index.html',
    controller: 'ChatController'
   });
}])
.directive('chatWindow', require('./directives/chat-window'))
.controller('ChatController', require('./controller'));
