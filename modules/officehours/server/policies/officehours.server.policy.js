'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Officehours Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/officehours',
      permissions: '*'
    }, {
      resources: '/api/officehours/:officehourId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/officehours',
      permissions: ['get', 'post']
    }, {
      resources: '/api/officehours/:officehourId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/officehours',
      permissions: ['get']
    }, {
      resources: '/api/officehours/:officehourId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Officehours Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Officehour is being processed and the current user created it then allow any manipulation
 // TAs and Professors are allowed to completely edit office hours, students are only allowed to add themselves to
// the interested student list of another office hour.
  if (req.user && (req.user.typeOfUser === 'ta' || req.user.typeOfUser === 'professor' || req.user.typeOfUser === 'student') || (req.officehour && req.user && req.officehour.user && req.officehour.user.id === req.user.id)) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
