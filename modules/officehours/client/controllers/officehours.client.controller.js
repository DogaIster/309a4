(function () {
  'use strict';

  // Officehours controller
  angular
    .module('officehours')
    .controller('OfficehoursController', OfficehoursController);

  OfficehoursController.$inject = ['$scope', '$state', 'Authentication', 'officehourResolve'];

  function OfficehoursController ($scope, $state, Authentication, officehour) {
    var vm = this;

    if (!$scope.user) {
      $scope.user = window.user;
    }

    vm.authentication = Authentication;
    vm.officehour = officehour;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

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
