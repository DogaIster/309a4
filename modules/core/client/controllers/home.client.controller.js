'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;

    if (window.user !== $scope.authentication.user && window.location !== '/authentication/signin') {
      window.location = '/';
      location.reload();
    }
  }
]);
