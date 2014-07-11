var heliotropeDev = angular.module('heliotropeDev', ['heliotrope', 'ngMockE2E']);
console.debug(heliotropeDev);
heliotropeDev.config(function($provide) {
  $provide.decorator('$httpBackend', angular.mock.e2e.$httpBackendDecorator);
});
heliotropeDev.run(function($httpBackend) {
  console.debug($httpBackend);
  $httpBackend.whenGET(/^\/\w+\/api/).respond(function(method, url, data) {
    console.debug(method, url, data);
  });
});

