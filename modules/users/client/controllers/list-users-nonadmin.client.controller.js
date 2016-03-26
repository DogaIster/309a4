'use strict';

angular.module('users.admin').controller('UserNonAdminListController', ['$scope', '$filter', 'Admin',
  function ($scope, $filter, Admin) {
    Admin.query(function (data) {
      $scope.users = data;
      $scope.buildPager();
    });

    $scope.buildPager = function () {
      $scope.pagedItems = [];
      $scope.itemsPerPage = 15;
      $scope.currentPage = 1;
      $scope.figureOutItemsToDisplay();
    };

    // set the user variable in the scope for the current logged-in user
    if (!$scope.user) {
      $scope.user = window.user;
    }

    $scope.classesInCommon = function(comparingUser) {
      var inCommon = [];
      alert("hi");
      for (var i = 0; i < comparingUser.length; i++) {
        if ($scope.user.classes.indexOf(comparingUser[i]) > -1) {
          inCommon.push(comparingUser[i]);
        }
      }
      return inCommon;    
    };

    $scope.figureOutItemsToDisplay = function () {
      $scope.filteredItems = $filter('filter')($scope.users, {
        $: $scope.search
      });

      if ($scope.selectUserType === 'professor') {
        $scope.filteredItems = $filter('filter')($scope.filteredItems, function(value, index, array) {
          return array[index].typeOfUser === 'professor';
        });
      }

      if ($scope.selectUserType === 'ta') {
        $scope.filteredItems = $filter('filter')($scope.filteredItems, function(value, index, array) {
          return array[index].typeOfUser === 'ta';
        });
      }

      if ($scope.selectUserType === 'student') {
        $scope.filteredItems = $filter('filter')($scope.filteredItems, function(value, index, array) {
          return array[index].typeOfUser === 'student';
        });
      }

      $scope.filterLength = $scope.filteredItems.length;
      var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
      var end = begin + $scope.itemsPerPage;
      $scope.pagedItems = $scope.filteredItems.slice(begin, end);
    };

    $scope.pageChanged = function () {
      $scope.figureOutItemsToDisplay();
    };
  }
]);
