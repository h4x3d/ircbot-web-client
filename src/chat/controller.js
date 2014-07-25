'use strict';

var _ = require('lodash');

function Channel(channel) {
  for(var key in channel) {
    this[key] = channel[key];
  }
  this.messages = [];
}

function Message(opts) {
  for(var key in opts) {
    this[key] = opts[key];
  }
  this.timestamp = Date.now();
}

module.exports = ['$scope', 'irc', function($scope, irc) {

  $scope.channels = [];
  $scope.me = null;

  irc.channels.getList().then(function(channels) {
    $scope.channels = channels.map(function(channel) {
      return new Channel(channel);
    });
  });

  irc.me().then(function(nickname) {
    $scope.me = nickname;
  });


  var messages = [];

  $scope.visibleMessages = [];
  $scope.inputMode = null;
  $scope.currentChannel = null;

  $scope.showChannel = function(channel) {
    $scope.currentChannel = channel;
    updateVisibleMessages();
    $scope.inputMode = 'chat';
  };

  $scope.part = function(channel) {
    irc.channels.part(channel.name).then(function() {
      removeChannel(channel.name);
    });
  };

  $scope.join = function() {
    if(!$scope.channel) return;

    if($scope.channel[0] !== '#') {
      $scope.channel = '#' + $scope.channel;
    }

    irc.channels.join($scope.channel).then(function(channel) {
      addChannel(channel);
      $scope.showChannel(channel);
    });

    $scope.channel = null;
  };

  $scope.send = send;

  $scope.setInputMode = function(mode) {
    $scope.inputMode = mode;
  };

  $scope.inputVisible = function() {
    return $scope.currentChannel || ($scope.inputMode && $scope.inputMode !== 'chat');
  };

  function addMessage(message) {
    messages.push(new Message(message));
    updateVisibleMessages();
  }

  function addChannel(channel) {
    $scope.channels.push(new Channel(channel));
  }

  function removeChannel(name) {
    $scope.channels = $scope.channels.filter(function(channel) {
      return channel.name !== name;
    });
  }

  function send() {
    if(!$scope.currentChannel) return;

    irc.send($scope.currentChannel.name, $scope.message);

    addMessage({
      from: $scope.me,
      to: $scope.currentChannel.name,
      message: $scope.message
    });

    $scope.message = null;
  }


  updateVisibleMessages();
  function updateVisibleMessages() {
    if(!$scope.currentChannel) {
      $scope.visibleMessages = messages;
      return;
    }
    $scope.visibleMessages = messages.filter(function(message) {
      return message.to === $scope.currentChannel.name;
    });
  }

  irc.on('join', function(event) {
    if(_.findWhere($scope.channels, {name: event.channel})) {
      return;
    }

    $scope.channels.push(new Channel({
      name: event.channel
    }));
  });

  irc.on('part', function(event) {
    event.channels.forEach(removeChannel);
  });

  irc.on('nick', function(event) {
    if(event.nick === $scope.me) {
      $scope.me = event.new;
    }
  });

  irc.on('message', addMessage);

}];
