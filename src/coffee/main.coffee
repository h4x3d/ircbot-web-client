angular = require 'angular'
ngRoute = require 'angular-route'

angular.module 'templates', []
require '../../tmp/templates.js'

module = angular.module 'app', ['ngRoute', 'templates']
module.directive 'example', require './directives/example.coffee'
