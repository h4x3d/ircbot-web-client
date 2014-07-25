'use strict';

module.exports = ['$parse', '$timeout', function($parse, $timeout) {
  return {
    restrict: 'A',
    link: function($scope, element, attrs) {
      if(attrs.focusWhen) {
        var model = $parse(attrs.focusWhen);
        $scope.$watch(model, function(value) {
          if(!value) return;
          $timeout(function() {
            element[0].focus();
          }, 1);
        });
      }
      if(attrs.focusWatch) {
        var watch = $parse(attrs.focusWatch);
        $scope.$watch(watch, function(value) {
          if(!value) return;
          $timeout(function() {
            element[0].focus();
          }, 1);
        });
      }
    }
  };
}];
