'use strict';

angular.module('socrataApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/ana', {
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      });
  });