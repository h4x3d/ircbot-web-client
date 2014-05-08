module.exports = ->
  restrict:    'E'
  replace:     true
  templateUrl: 'directives/example.html'
  scope:       false

  link: (scope, elem, attrs) ->
