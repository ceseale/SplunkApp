'use strict';

angular.module('socrataApp')
  .controller('NavbarCtrl', function ($scope, $location) {
    $scope.menu = [{
      'title': 'Fatal Visualizations',
      'link': '/terrormap'
    }, {
      'title': 'Analyze Global Terrorism (2000-2013)',
      'link': '/terrormap'
    }, {
      'title': 'Simulate U.S. EMS Arrival (2001-2013)',
      'link': '/timemap'
    }, {

      'title': 'Analyze Accident Survival Times (2001-2013)',
      'link': '/ana'
    }


    ];

    $scope.isCollapsed = true;

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });