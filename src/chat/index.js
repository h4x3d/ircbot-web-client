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

  irc.on('message', function(message) {
    messages.push(new Message(message));
    updateVisibleMessages();
  });

}]).directive('chatWindow', function() {
  return {
    restrict: 'A',
    link: function($scope, element, attrs) {

      var scrollLocked = false;

      function scrollToBottom() {
        if(scrollLocked) return;
        var scrollHeight = element.prop('scrollHeight');
        element[0].scrollTop = scrollHeight;
      }

      $scope.$watch(attrs.chatWindowMessages, function() {
        scrollToBottom();
      }, true);

      element.on('scroll', function() {
        var style = window.getComputedStyle(element[0]);
        var innerHeight = parseInt(style.getPropertyValue('height'));
        var scrollPosition = element.prop('scrollHeight') - element[0].scrollTop;
        scrollLocked = scrollPosition - innerHeight > 50;
      });
    }
  };
});
