//Officehours service used to communicate Officehours REST endpoints
(function () {
  'use strict';

  angular
    .module('officehours')
    .factory('OfficehoursService', OfficehoursService);

  OfficehoursService.$inject = ['$resource'];

  function OfficehoursService($resource) {
    return $resource('api/officehours/:officehourId', {
      officehourId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
