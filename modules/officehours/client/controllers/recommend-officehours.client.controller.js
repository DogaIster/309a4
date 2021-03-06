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
    vm.saveDisInterest = saveDisInterest;

    var now = new Date();

    var addRandom = function(destArray, sourceArray) {
      for (var i = 0; i < sourceArray.length; i++) {
        if (Math.random() * 10 < 2 && destArray.indexOf(sourceArray[i]) === -1) {
          destArray.push(sourceArray[i]);
        }
      }
    };

    var containsUser = function(array, object) {
      for (var i = 0; i < array.length; i++) {
        if (array[i] !== null && array[i].displayName === object.displayName) {
          return true;
        }
      }
      return false;
    };

    var indexOfUser = function(array, object) {
      for (var i = 0; i < array.length; i++) {
        if (array[i] !== null && array[i].displayName === object.displayName) {
          return i;
        }
      }
      return -1;
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

    // other helper function specifically for students
    var containsCreatedUser = function(array, object) {
      for (var i = 0; i < array.length; i++) {
        if (array[i] === object._id) {
          return true;
        }
      }
      return false;
    };

    // adds classes in the same department to a list
    var addUserDepartmentClasses = function(arrayToAddTo, arrayToAddFrom) {
      for (var i = 0; i < arrayToAddFrom.length; i++) {
        for (var j = 0; j < $scope.user.classes; j++) {
          // if the class is in the same department
          if (arrayToAddTo.indexOf(arrayToAddFrom[i]) === -1 && $scope.user.classes[j].substring(0, 2) === arrayToAddFrom[i].substring(0,2)) {
            arrayToAddTo.push(arrayToAddFrom[i]);
          }
        }
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

      // only recommend upcoming office hours
      $scope.filteredItems = $filter('filter')($scope.filteredItems, function(value, index, array) {
        return new Date(array[index].time) > now;
      });

      // before any filtration, other than the date, has occured
      var prefilteredItems = $scope.filteredItems;

      // make sure the user hasn't already expressed interest in this office hour
      if ($scope.user.typeOfUser === 'student') {
        $scope.filteredItems = $filter('filter')($scope.filteredItems, function(value, index, array) {
          return !containsUser(array[index].students, $scope.user) && !containsCreatedUser(array[index].students, $scope.user);
        });
      }

      if ($scope.user.typeOfUser === 'professor') {
        $scope.filteredItems = $filter('filter')($scope.filteredItems, function(value, index, array) {
          return array[index].professorName !== $scope.user.displayName;
        });
      }


      if ($scope.user.typeOfUser === 'ta') {
        $scope.filteredItems = $filter('filter')($scope.filteredItems, function(value, index, array) {
          return !containsUser(array[index].tas, $scope.user) && !containsCreatedUser(array[index].tas, $scope.user);
        });
      }

      var backupList = $scope.filteredItems;
      addUserDepartmentClasses($scope.filteredItems, backupList);

      // randomly determine if the office hours should include professors & student interest
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

      $scope.filterLength = $scope.filteredItems.length;

      if ($scope.filterLength === 0) {
        $scope.filteredItems = prefilteredItems;
      }

      $scope.filterLength = $scope.filteredItems.length;

      addRandom($scope.filteredItems, prefilteredItems);
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

    function saveDisInterest(officehour) {
      if ($scope.user && $scope.user.typeOfUser === 'professor') {
        officehour.professor = null;
        officehour.professorName = '';
      }

      else if ($scope.user && $scope.user.typeOfUser === 'ta') {
        if (containsUser(officehour.tas, $scope.user)) {
          var taIndex = indexOfUser(officehour.tas, $scope.user);
          if (taIndex > -1) {
            officehour.tas.splice(taIndex, 1);
          }
        }
      }

      else {
        var studentIndex = indexOfUser(officehour.students, $scope.user);
        if (studentIndex > -1) {
          officehour.students.splice(studentIndex, 1);
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
