(function () {
  'use strict';

  describe('Officehours Route Tests', function () {
    // Initialize global variables
    var $scope,
      OfficehoursService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _OfficehoursService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      OfficehoursService = _OfficehoursService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('officehours');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/officehours');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          OfficehoursController,
          mockOfficehour;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('officehours.view');
          $templateCache.put('modules/officehours/client/views/view-officehour.client.view.html', '');

          // create mock Officehour
          mockOfficehour = new OfficehoursService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Officehour Name'
          });

          //Initialize Controller
          OfficehoursController = $controller('OfficehoursController as vm', {
            $scope: $scope,
            officehourResolve: mockOfficehour
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:officehourId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.officehourResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            officehourId: 1
          })).toEqual('/officehours/1');
        }));

        it('should attach an Officehour to the controller scope', function () {
          expect($scope.vm.officehour._id).toBe(mockOfficehour._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/officehours/client/views/view-officehour.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          OfficehoursController,
          mockOfficehour;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('officehours.create');
          $templateCache.put('modules/officehours/client/views/form-officehour.client.view.html', '');

          // create mock Officehour
          mockOfficehour = new OfficehoursService();

          //Initialize Controller
          OfficehoursController = $controller('OfficehoursController as vm', {
            $scope: $scope,
            officehourResolve: mockOfficehour
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.officehourResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/officehours/create');
        }));

        it('should attach an Officehour to the controller scope', function () {
          expect($scope.vm.officehour._id).toBe(mockOfficehour._id);
          expect($scope.vm.officehour._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/officehours/client/views/form-officehour.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          OfficehoursController,
          mockOfficehour;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('officehours.edit');
          $templateCache.put('modules/officehours/client/views/form-officehour.client.view.html', '');

          // create mock Officehour
          mockOfficehour = new OfficehoursService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Officehour Name'
          });

          //Initialize Controller
          OfficehoursController = $controller('OfficehoursController as vm', {
            $scope: $scope,
            officehourResolve: mockOfficehour
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:officehourId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.officehourResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            officehourId: 1
          })).toEqual('/officehours/1/edit');
        }));

        it('should attach an Officehour to the controller scope', function () {
          expect($scope.vm.officehour._id).toBe(mockOfficehour._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/officehours/client/views/form-officehour.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
