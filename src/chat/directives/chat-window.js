'use strict';

module.exports = function() {
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
};
