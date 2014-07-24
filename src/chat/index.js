'use strict';

require('angular');
require('angular-route');
require('angular-moment');

require('../auth');
require('../irc');
require('../config');

function Channel(identifier) {
  this.identifier = identifier;
  this.name = identifier.split(' ')[0];
  this.messages = [];
}
function Message(opts) {
  for(var key in opts) {
    this[key] = opts[key];
  }
  this.timestamp = Date.now();
}

angular
.module('chat', ['ngRoute', 'http-auth-interceptor', 'auth', 'irc', 'config', 'angularMoment'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider
   .when('/', {
    templateUrl: 'chat/index.html',
    controller: 'ChatController',
    resolve: {
      config: ['Config', function(Config) {
        return Config.get();
      }]
    }
   });
}])
.controller('ChatController', ['$scope', 'irc', 'config', function($scope, irc, config) {

  $scope.channels = config.channels.map(function(channel) {
    return new Channel(channel);
  });

  var messages = [];

  $scope.visibleMessages = [];

  $scope.filter = null;

  $scope.filterMessagesBy = function(channel) {
    $scope.filter = channel;
    updateVisibleMessages();
  };

  function addMessage(message) {
    messages.push(new Message(message));
    updateVisibleMessages();
  }

  function sendMessage() {
    if(!$scope.filter) return;

    irc.send($scope.filter.name, $scope.message);

    addMessage({
      from: config.nickname,
      to: $scope.filter.name,
      message: $scope.message
    });

    $scope.message = null;
  }

  $scope.keypressed = function(event) {
    if(event.keyCode !== 13) return;
    sendMessage();
  };

  updateVisibleMessages();
  function updateVisibleMessages() {
    if(!$scope.filter) {
      $scope.visibleMessages = messages;
      return;
    }
    $scope.visibleMessages = messages.filter(function(message) {
      return message.to === $scope.filter.name;
    });
  }

  // irc.on('authenticated', function() {});
  // irc.on('data', function() {});

  irc.on('join', function(message) {
    $scope.channels.push(new Channel(message.channel));
  });

  irc.on('message', addMessage);

}]).directive('chatWindow', require('./directives/chat-window'));
