(function () {
  'use strict';

  // Officehours controller
  angular
    .module('officehours')
    .controller('OfficehoursController', OfficehoursController);

  OfficehoursController.$inject = ['$scope', '$state', 'Authentication', 'officehourResolve'];

  function OfficehoursController ($scope, $state, Authentication, officehour) {
    var vm = this;

    vm.authentication = Authentication;
    vm.officehour = officehour;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    
    // Remove existing Officehour
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.officehour.$remove($state.go('officehours.list'));
      }
    }

    // Save Officehour
    function save(isValid) {
      if (!isValid && !vm.officehour.time) {
        vm.officehour.time = document.getElementById('time').value;
        isValid = true;
      }
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.officehourForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.officehour._id) {
        vm.officehour.$update(successCallback, errorCallback);
      } else {
        vm.officehour.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('officehours.view', {
          officehourId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
