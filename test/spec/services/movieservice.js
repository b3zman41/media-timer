'use strict';

describe('Service: MovieService', function () {

  // load the service's module
  beforeEach(module('mediatimerApp'));

  // instantiate service
  var MovieService;
  beforeEach(inject(function (_MovieService_) {
    MovieService = _MovieService_;
  }));

  it('should do something', function () {
    expect(!!MovieService).toBe(true);
  });

});
