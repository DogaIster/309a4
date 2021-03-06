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

    // Add the dropdown Recomend item
    Menus.addSubMenuItem('topbar', 'officehours', {
      title: 'Recomended Office Hours',
      state: 'officehours.recommend'
    });

    // Add the dropdown create item
    if (window.user && window.user.typeOfUser === 'student') {
      Menus.addSubMenuItem('topbar', 'officehours', {
        title: 'Request Office Hour Booking',
        state: 'officehours.create',
        roles: ['user']
      });
    }

    if (window.user && window.user.typeOfUser === 'ta') {
      Menus.addSubMenuItem('topbar', 'officehours', {
        title: 'Offer Office Hour Booking',
        state: 'officehours.create',
        roles: ['user']
      });
    }

    if (window.user && window.user.typeOfUser === 'professor') {
      Menus.addSubMenuItem('topbar', 'officehours', {
        title: 'Offer Office Hour',
        state: 'officehours.create',
        roles: ['admin']
      });
    }

  }
})();
