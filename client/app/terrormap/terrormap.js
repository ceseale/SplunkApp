'use strict';

angular.module('socrataApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/terrormap', {
        templateUrl: 'app/terrormap/terrormap.html',
        controller: 'TerrormapCtrl'
      });
  });
