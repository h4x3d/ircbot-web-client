'use strict';

require('angular');
require('angular-route');
require('angular-moment');

require('../auth');
require('../irc');

angular
.module('chat', ['ngRoute', 'http-auth-interceptor', 'auth', 'irc', 'angularMoment'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider
   .when('/', {
    templateUrl: 'chat/index.html',
    controller: 'ChatController'
   });
}])
.directive('chatWindow', require('./directives/chat-window'))
.directive('focusWhen', require('./directives/focus-when'))
.controller('ChatController', require('./controller'));
