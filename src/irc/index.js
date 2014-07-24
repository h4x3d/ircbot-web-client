'use strict';

require('angular-socket-io');

var io = require('socket.io-client');

angular
.module('irc', ['btford.socket-io', 'restangular', 'auth'])
.factory('irc', ['socketFactory', 'Auth', '$rootScope', function(socketFactory, Auth, $rootScope) {

  var connection = io.connect('ws://localhost:9001');
  var socket = socketFactory({ioSocket: connection });

  function requireAuthentication() {
    $rootScope.$emit('event:auth-loginRequired');
    var removeListener = $rootScope.$on('event:auth-loginConfirmed', function() {
      socket.emit('authenticate', {
        token: Auth.getToken()
      });

      removeListener();
    });
  }

  socket.on('connect', function() {

    var token = Auth.getToken();

    if(token) {
      return socket.emit('authenticate', {
        token: token
      });
    }
    requireAuthentication();
  });

  socket.on('error', function(err) {
    if(['credentials_required', 'invalid_token'].indexOf(err.code) > -1) {
      requireAuthentication();
    }
  });

  socket.send = function(target, message) {
    socket.emit('send', {
      target: target,
      message: message
    });
  };

  return socket;

}]);
