(function () {
  'use strict';

  angular
    .module('officehours')
    .controller('OfficehoursRecommendController', OfficehoursRecommendController);

  OfficehoursRecommendController.$inject = ['$scope', '$filter', '$state','OfficehoursService'];

  function OfficehoursRecommendController($scope, $filter, $state, OfficehoursService) {
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

    vm.saveInterest = saveInterest;
    vm.saveComment = saveComment;

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

    // This function is taken from http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript
    /**
    * Shuffles array in place.
    * @param {Array} a items The array containing the items.
    */
    var shuffle = function(a) {
      var j, x, i;
      for (i = a.length; i; i -= 1) {
          j = Math.floor(Math.random() * i);
          x = a[i - 1];
          a[i - 1] = a[j];
          a[j] = x;
        }
    };

    // for search
    $scope.buildPager = function () {
      $scope.pagedItems = [];
      $scope.itemsPerPage = Math.round(Math.random() * 10);
      $scope.currentPage = 1;
      $scope.figureOutItemsToDisplay();
    };

    $scope.figureOutItemsToDisplay = function () {
      $scope.filteredItems = $filter('filter')($scope.officehours, {
        class: $scope.search
      });

      var sortDirection = true;

      if ($scope.orderByDirection === 'ascending') {
        sortDirection = true;
      }

      if ($scope.orderByDirection === 'descending') {
        sortDirection = false;
      }

      // make sure the user hasn't already expressed interest in this office hour
      $scope.filteredItems = $filter('filter')($scope.filteredItems, function(value, index, array) {
        return !containsUser(array[index].students, $scope.user) && !containsCreatedUser(array[index].students, $scope.user);
      });

      var backupList = $scope.filteredItems;

      $scope.filteredItems = $filter('filter')($scope.filteredItems, function(value, index, array) {
          return new Date(array[index].time) > now;
      });

      if (Math.random() * 10 < 3) {
        $scope.filteredItems = $filter('filter')($scope.filteredItems, function(value, index, array) {
          return array[index].professor;
        });
      }

      if (Math.random() * 10 < 3) {
        $scope.filteredItems = $filter('filter')($scope.filteredItems, function(value, index, array) {
          return array[index].students.length > 0;
        });
      }

      $scope.filteredItems = $filter('filter')($scope.filteredItems, function(value, index, array) {
        return $scope.user.classes.indexOf(array[index].class) > -1;
      });

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

      if ($scope.filterLength === 0) {
        $scope.filteredItems = backupList;
      }

      shuffle($scope.filteredItems);
      var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
      var end = begin + $scope.itemsPerPage;
      $scope.pagedItems = $scope.filteredItems.slice(begin, end);
    };

    $scope.pageChanged = function () {
      $scope.figureOutItemsToDisplay();
    };

    // Save Officehour
    function saveInterest(officehour) {
      // TODO: move create/update logic to service
      if ($scope.user && $scope.user.typeOfUser === 'professor') {
        officehour.professor = $scope.user;
        officehour.professorName = $scope.user.firstName + ' ' + $scope.user.lastName;
      }

      else if ($scope.user && $scope.user.typeOfUser === 'ta') {
        if (!containsUser(officehour.tas, $scope.user)) {
          officehour.tas.push($scope.user);
        }
      }

      else {
        if (!containsUser(officehour.students, $scope.user)) {
          officehour.students.push($scope.user);
        }
      }

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

    //Save comment
    function saveComment(officehour) {

      officehour.comments.push(
        { text: officehour.commentSubmission,
          time: new Date(),
          _id: $scope.user._id,
          profileImageURL: $scope.user.profileImageURL,
          displayName: $scope.user.displayName
        }
      );

      officehour.commentSubmission = undefined;

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
