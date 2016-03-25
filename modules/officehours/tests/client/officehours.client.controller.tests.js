(function () {
  'use strict';

  describe('Officehours Controller Tests', function () {
    // Initialize global variables
    var OfficehoursController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      OfficehoursService,
      mockOfficehour;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _OfficehoursService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      OfficehoursService = _OfficehoursService_;

      // create mock Officehour
      mockOfficehour = new OfficehoursService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Officehour Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Officehours controller.
      OfficehoursController = $controller('OfficehoursController as vm', {
        $scope: $scope,
        officehourResolve: {}
      });

      //Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleOfficehourPostData;

      beforeEach(function () {
        // Create a sample Officehour object
        sampleOfficehourPostData = new OfficehoursService({
          name: 'Officehour Name'
        });

        $scope.vm.officehour = sampleOfficehourPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (OfficehoursService) {
        // Set POST response
        $httpBackend.expectPOST('api/officehours', sampleOfficehourPostData).respond(mockOfficehour);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Officehour was created
        expect($state.go).toHaveBeenCalledWith('officehours.view', {
          officehourId: mockOfficehour._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/officehours', sampleOfficehourPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Officehour in $scope
        $scope.vm.officehour = mockOfficehour;
      });

      it('should update a valid Officehour', inject(function (OfficehoursService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/officehours\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('officehours.view', {
          officehourId: mockOfficehour._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (OfficehoursService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/officehours\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });
    
    describe('vm.saveInterest() as update', function () {
      beforeEach(function () {
        // Mock Officehour in $scope
        $scope.vm.officehour = mockOfficehour;
        $scope.vm.officehour.students = [];
        $scope.user = {
          typeOfUser: 'student'
        };
      });

      it('should update a valid Officehour', inject(function (OfficehoursService) {
        $httpBackend.expectPUT(/api\/officehours\/([0-9a-fA-F]{24})$/).respond();
        // Run controller functionality
        $scope.vm.saveInterest($scope.vm.officehour);
        $httpBackend.flush();
      }));

      it('should set $scope.vm.error if error', inject(function (OfficehoursService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/officehours\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.saveInterest($scope.vm.officehour);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.saveDisInterest() as update', function () {
      beforeEach(function () {
        // Mock Officehour in $scope
        $scope.vm.officehour = mockOfficehour;
        $scope.vm.officehour.students = [];
        $scope.user = {
          typeOfUser: 'student'
        };
      });

      it('should update a valid Officehour', inject(function (OfficehoursService) {
        $httpBackend.expectPUT(/api\/officehours\/([0-9a-fA-F]{24})$/).respond();
        // Run controller functionality
        $scope.vm.saveDisInterest($scope.vm.officehour);
        $httpBackend.flush();
      }));

      it('should set $scope.vm.error if error', inject(function (OfficehoursService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/officehours\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.saveDisInterest($scope.vm.officehour);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.saveComment() as update', function () {
      beforeEach(function () {
        // Mock Officehour in $scope
        $scope.vm.officehour = mockOfficehour;
        $scope.vm.officehour.students = [];
        $scope.vm.officehour.comments = ['Hi!'];
        $scope.user = {
          typeOfUser: 'student'
        };
      });

      it('should update a valid Officehour', inject(function (OfficehoursService) {
        $httpBackend.expectPUT(/api\/officehours\/([0-9a-fA-F]{24})$/).respond();
        // Run controller functionality
        $scope.vm.saveComment($scope.vm.officehour);
        $httpBackend.flush();
      }));

      it('should set $scope.vm.error if error', inject(function (OfficehoursService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/officehours\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.saveComment($scope.vm.officehour);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        //Setup Officehours
        $scope.vm.officehour = mockOfficehour;
      });

      it('should delete the Officehour and redirect to Officehours', function () {
        //Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/officehours\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('officehours.list');
      });

      it('should should not delete the Officehour and not redirect', function () {
        //Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
})();