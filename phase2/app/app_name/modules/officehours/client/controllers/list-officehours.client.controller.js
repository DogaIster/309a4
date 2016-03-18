(function () {
  'use strict';

  angular
    .module('officehours')
    .controller('OfficehoursListController', OfficehoursListController);

  OfficehoursListController.$inject = ['$scope', '$filter', '$state','OfficehoursService'];

  function OfficehoursListController($scope, $filter, $state, OfficehoursService) {
    var vm = this;

    // set the user variable in the scope for the current logged-in user
    if (!$scope.user) {
      $scope.user = window.user;
    }

    //vm.officehours = OfficehoursService.query();

    OfficehoursService.query(function (data) {
      $scope.officehours = data;
      $scope.buildPager();
    });

    vm.save = save;

    var now = new Date();

    var containsUser = function(array, object) {
      for (var i = 0; i < array.length; i++) {
        if (array[i].displayName === object.displayName) {
          return true;
        }
      }
      return false;
    };

    // other helper function specifically for students
    var containsCreatedUser = function(array, object) {
      for (var i = 0; i < array.length; i++) {
        if (array[i] === object._id) {
          return true;
        }
      }
      return false;
    };

    // for search
    $scope.buildPager = function () {
      $scope.pagedItems = [];
      $scope.itemsPerPage = 10;
      $scope.currentPage = 1;
      $scope.figureOutItemsToDisplay();
    };

    $scope.figureOutItemsToDisplay = function () {
      $scope.filteredItems = $filter('filter')($scope.officehours, {
        $: $scope.search
      });

      var sortDirection = true;

      if ($scope.orderByDirection === 'ascending') {
        sortDirection = true;
      }

      if ($scope.orderByDirection === 'descending') {
        sortDirection = false;
      }

      if ($scope.upcomingOfficeHours) {
        $scope.filteredItems = $filter('filter')($scope.filteredItems, function(value, index, array) {
          return new Date(array[index].time) > now;
        });
      }

      if ($scope.profOfficeHours) {
        $scope.filteredItems = $filter('filter')($scope.filteredItems, function(value, index, array) {
          return array[index].professor;
        });
      }

      if ($scope.taOfficeHours) {
        $scope.filteredItems = $filter('filter')($scope.filteredItems, function(value, index, array) {
          return array[index].tas.length > 0;
        });
      }

      if ($scope.studentInterest) {
        $scope.filteredItems = $filter('filter')($scope.filteredItems, function(value, index, array) {
          return containsUser(array[index].students, $scope.user) || containsCreatedUser(array[index].students, $scope.user);
        });
      }

      if ($scope.multipleStudentsInterested) {
        $scope.filteredItems = $filter('filter')($scope.filteredItems, function(value, index, array) {
          return array[index].students.length > 0;
        });
      }

      if ($scope.orderByType === 'numTAs') {
        $scope.filteredItems = $filter('orderBy')($scope.filteredItems, 'tas.length', sortDirection);
      }

      if ($scope.orderByType === 'numStudents') {
        $scope.filteredItems = $filter('orderBy')($scope.filteredItems, 'students.length', sortDirection);
      }

      if ($scope.orderByType === 'officehourDate') {
        $scope.filteredItems = $filter('orderBy')($scope.filteredItems, 'time', sortDirection);
      }

      $scope.filterLength = $scope.filteredItems.length;
      var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
      var end = begin + $scope.itemsPerPage;
      $scope.pagedItems = $scope.filteredItems.slice(begin, end);
    };

    $scope.pageChanged = function () {
      $scope.figureOutItemsToDisplay();
    };

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
