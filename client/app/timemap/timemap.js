'use strict';

angular.module('socrataApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/timemap/timemap.html',
        controller: 'TimemapCtrl'
      });
  });
