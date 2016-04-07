'use strict';
angular.module('users.admin').controller('UserController', ['$scope', '$state', 'Authentication', 'userResolve',
  function ($scope, $state, Authentication, userResolve) {
    $scope.authentication = Authentication;
    $scope.user = userResolve;
    var vm = this;

    $scope.remove = function (user) {
      if (confirm('Are you sure you want to delete this user?')) {
        if (user) {
          user.$remove();

          $scope.users.splice($scope.users.indexOf(user), 1);
        } else {
          $scope.user.$remove(function () {
            $state.go('admin.users');
          });
        }
      }
    };

    $scope.update = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      var user = $scope.user;
      vm.saveComment = saveComment;
      /*this is not done*/
      function saveComment(user) {
     
      //console.log 
        vm.user.comments.push(
          { text: user.commentSubmission,
            time: new Date(),
            _id: $scope.user._id,
            profileImageURL: $scope.user.profileImageURL,
            displayName: $scope.user.displayName
          }
        );

        user.commentSubmission = undefined;

        //should always exist...
        if (user._id) {
          user.$update(successCallback, errorCallback);
        } else {
          user.$save(successCallback, errorCallback);
        }

        function successCallback(res) {
          console.log('success'); 

        }

        function errorCallback(res) {
          vm.error = res.data.message;
        }
      }

      user.$update(function () {
        $state.go('admin.user', {
          userId: user._id
        });
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
  }
]);
