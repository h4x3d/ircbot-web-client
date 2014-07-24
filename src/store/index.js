'use strict';

angular.module('store', [])
.service('Store', [function() {
  return {
    get: function(key) {
      return window.localStorage.getItem(key);
    },
    set: function(key, value) {
      return window.localStorage.setItem(key, value);
    }
  };
}]);
