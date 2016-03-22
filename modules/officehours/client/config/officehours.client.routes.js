(function () {
  'use strict';

  angular
    .module('officehours')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('officehours', {
        abstract: true,
        url: '/officehours',
        template: '<ui-view/>'
      })
      .state('officehours.list', {
        url: '',
        templateUrl: 'modules/officehours/client/views/list-officehours.client.view.html',
        controller: 'OfficehoursListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'List Office Hours'
        }
      })
      .state('officehours.reccomend', {
        url: '',
        templateUrl: 'modules/officehours/client/views/recommend-officehours.client.view.html',
        controller: 'OfficehoursRecommendController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Recomend Office Hours'
        }
      })
      .state('officehours.create', {
        url: '/create',
        templateUrl: 'modules/officehours/client/views/form-officehour.client.view.html',
        controller: 'OfficehoursController',
        controllerAs: 'vm',
        resolve: {
          officehourResolve: newOfficehour
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Officehours Create'
        }
      })
      .state('officehours.edit', {
        url: '/:officehourId/edit',
        templateUrl: 'modules/officehours/client/views/form-officehour.client.view.html',
        controller: 'OfficehoursController',
        controllerAs: 'vm',
        resolve: {
          officehourResolve: getOfficehour
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Officehour {{ officehourResolve.name }}'
        }
      })
      .state('officehours.view', {
        url: '/:officehourId',
        templateUrl: 'modules/officehours/client/views/view-officehour.client.view.html',
        controller: 'OfficehoursController',
        controllerAs: 'vm',
        resolve: {
          officehourResolve: getOfficehour
        },
        data:{
          pageTitle: 'Officehour {{ articleResolve.name }}'
        }
      });
  }

  getOfficehour.$inject = ['$stateParams', 'OfficehoursService'];

  function getOfficehour($stateParams, OfficehoursService) {
    return OfficehoursService.get({
      officehourId: $stateParams.officehourId
    }).$promise;
  }

  newOfficehour.$inject = ['OfficehoursService'];

  function newOfficehour(OfficehoursService) {
    return new OfficehoursService();
  }
})();
