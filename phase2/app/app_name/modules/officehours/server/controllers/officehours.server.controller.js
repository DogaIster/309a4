'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Officehour = mongoose.model('Officehour'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Officehour
 */
exports.create = function(req, res) {
  var officehour = new Officehour(req.body);
  officehour.user = req.user;

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
  officehour.isCurrentUserOwner = req.user && officehour.user && officehour.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(officehour);
};

/**
 * Update a Officehour
 */
exports.update = function(req, res) {
  var officehour = req.officehour ;

  officehour = _.extend(officehour , req.body);

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
      message: 'Officehour is invalid'
    });
  }

  Officehour.findById(id).populate('user', 'displayName').exec(function (err, officehour) {
    if (err) {
      return next(err);
    } else if (!officehour) {
      return res.status(404).send({
        message: 'No Officehour with that identifier has been found'
      });
    }
    req.officehour = officehour;
    next();
  });
};
