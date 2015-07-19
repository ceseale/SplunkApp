'use strict';

describe('Controller: TimemapCtrl', function () {

  // load the controller's module
  beforeEach(module('socrataApp'));

  var TimemapCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TimemapCtrl = $controller('TimemapCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
