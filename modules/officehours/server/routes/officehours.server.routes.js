'use strict';

/**
 * Module dependencies
 */
var officehoursPolicy = require('../policies/officehours.server.policy'),
  officehours = require('../controllers/officehours.server.controller');

module.exports = function(app) {
  // Officehours Routes
  app.route('/api/officehours').all(officehoursPolicy.isAllowed)
    .get(officehours.list)
    .post(officehours.create);

  app.route('/api/officehours/:officehourId').all(officehoursPolicy.isAllowed)
    .get(officehours.read)
    .put(officehours.update)
    .delete(officehours.delete);

  // Finish by binding the Officehour middleware
  app.param('officehourId', officehours.officehourByID);
};
