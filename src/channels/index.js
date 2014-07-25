'use strict';

require('angular');

angular.module('channels', ['restangular'])
.service('Channels', ['Restangular', function(Restangular) {

  var Channels = Restangular.all('channels');

  function part(name) {
    return Channels.remove({
      name: name
    });
  }

  function join(name, password) {
    return Channels.post({
      name: name,
      password: password
    });
  }

  return {
    getList: Channels.getList,
    part: part,
    join: join
  };


}]);
