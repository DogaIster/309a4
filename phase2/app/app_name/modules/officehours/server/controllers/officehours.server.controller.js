'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Officehour = mongoose.model('Officehour'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');


  // helper function to see if a user is in an array
  // thank you to http://stackoverflow.com/questions/4587061/how-to-determine-if-object-is-in-array
  // for showing me that there's no easier way to do this in JS.
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

/**
 * Create a Officehour
 */
exports.create = function(req, res) {
  var officehour = new Officehour(req.body);
  officehour.user = req.user;

  // add the requested users to list of users
  if (req.user && req.user.typeOfUser === 'student') {
    if (!containsCreatedUser(officehour.students, req.user) && !containsUser(officehour.students, req.user)) {
      officehour.students.push(req.user);
    }
  }

  else if (req.user && req.user.typeOfUser === 'professor') {
    officehour.professor = req.user;
    officehour.professorName = req.user.displayName;
  }

  else if (req.user && req.user.typeOfUser === 'ta') {
    if (!containsUser(officehour.tas, req.user)) {
      officehour.tas.push(req.user);
    }
  }

  officehour.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(officehour);
    }
  });
};

/**
 * Show the current Officehour
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var officehour = req.officehour ? req.officehour.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  // TAs and Professors are allowed to completely edit office hours, students are only allowed to add themselves to
  // the interested student list of another office hour.
  officehour.isCurrentUserOwner = (req.user.typeOfUser === 'ta' || req.user.typeOfUser === 'professor') || (req.user && officehour.user && officehour.user._id.toString() === req.user._id.toString()) ? true : false;

  res.jsonp(officehour);
};

/**
 * Update a Officehour
 */
exports.update = function(req, res) {
  var officehour = req.officehour;
  officehour = _.extend(officehour , req.body);

  if (req.user && req.user.typeOfUser === 'professor') {
    officehour.professor = req.user;
    officehour.professorName = req.user.firstName + ' ' + req.user.lastName;
  }

  else if (req.user && req.user.typeOfUser === 'ta') {
    if (!containsUser(officehour.tas, req.user)) {
      officehour.tas.push(req.user);
    }
  }

  else {
    if (!containsUser(officehour.students, req.user)) {
      officehour.students.push(req.user);
    }
  }

  officehour.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(officehour);
    }
  });
};

/**
 * Delete an Officehour
 */
exports.delete = function(req, res) {
  var officehour = req.officehour ;

  officehour.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(officehour);
    }
  });
};

/**
 * List of Officehours
 */
exports.list = function(req, res) {
  Officehour.find().sort('-created').populate('user', 'displayName').exec(function(err, officehours) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(officehours);
    }
  });
};

/**
 * Officehour middleware
 */
exports.officehourByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Office hour is invalid'
    });
  }

  Officehour.findById(id).populate('user', 'displayName').exec(function (err, officehour) {
    if (err) {
      return next(err);
    } else if (!officehour) {
      return res.status(404).send({
        message: 'No Office hour with that identifier has been found'
      });
    }
    req.officehour = officehour;
    next();
  });
};
