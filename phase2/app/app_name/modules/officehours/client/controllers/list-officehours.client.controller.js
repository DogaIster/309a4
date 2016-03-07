(function () {
  'use strict';

  angular
    .module('officehours')
    .controller('OfficehoursListController', OfficehoursListController);

  OfficehoursListController.$inject = ['OfficehoursService'];

  function OfficehoursListController(OfficehoursService) {
    var vm = this;

    vm.officehours = OfficehoursService.query();
  }
})();
