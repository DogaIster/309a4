(function () {
  'use strict';

  angular
    .module('officehours')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Office Hours',
      state: 'officehours',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'officehours', {
      title: 'List Office Hours',
      state: 'officehours.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'officehours', {
      title: 'Create Office Hour Booking',
      state: 'officehours.create',
      roles: ['user']
    });
  }
})();