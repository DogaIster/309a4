(function () {
  'use strict';

  angular
    .module('officehours')
    .controller('OfficehoursListController', OfficehoursListController);

  OfficehoursListController.$inject = ['$scope', '$state','OfficehoursService'];

  function OfficehoursListController($scope, $state, OfficehoursService) {
    var vm = this;

    // set the user variable in the scope for the current logged-in user
    if (!$scope.user) {
      $scope.user = window.user;
    }

    vm.officehours = OfficehoursService.query();
    vm.save = save;
    vm.containsUser = containsUser;

    // helper function to see if a user is in an array
    // thank you to http://stackoverflow.com/questions/4587061/how-to-determine-if-object-is-in-array
    // for showing me that there's no easier way to do this in JS.
    function containsUser(array, object) {
        for (var i = 0; i < array.length; i++) {
          if (array[i].displayName === object.displayName) {
              return true;
          }
        }

        return false;
    }

    // Save Officehour
    function save(officehour) {
      // TODO: move create/update logic to service
      if (officehour._id) {
        officehour.$update(successCallback, errorCallback);
      } else {
        officehour.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        //$state.go('officehours.list', {
        //  officehourId: res._id
        //});
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
