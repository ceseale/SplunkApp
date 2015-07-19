'use strict';

describe('Controller: TerrormapCtrl', function () {

  // load the controller's module
  beforeEach(module('socrataApp'));

  var TerrormapCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TerrormapCtrl = $controller('TerrormapCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
