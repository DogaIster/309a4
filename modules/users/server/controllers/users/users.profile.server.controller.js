'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  fs = require('fs'),
  path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  Officehour = mongoose.model('Officehour'),
  User = mongoose.model('User');

/**
 * Update user details
 */
exports.update = function (req, res) {
  // Init Variables
  var user = req.user;

  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;

  if (user) {
    // Merge existing user
    user = _.extend(user, req.body);
    user.updated = Date.now();
    user.displayName = user.firstName + ' ' + user.lastName;

    user.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        req.login(user, function (err) {
          if (err) {
            res.status(400).send(err);
          } else {
            res.json(user);
          }
        });
      }
    });


    // TODO : ADD UPDATE TO ALL OFFICE HOUR FIELDS SO THAT
    // IF THE USER CHANGES THEIR NAME THE CHANGES ARE REFLECTED IN
    // THE OFFICE HOUR DB ENTRY
    // need to do this here since this is where the user changes

    // NOTE: this is a WIP

    // for updating officehours
    var errorCallback = function (err) {
      if(err) {
        console.error(err);
      }
    };
    /*
    Officehour.find().exec(function(err, officehours) {
      for (var i = 0; i < officehours.length; i++) {
        var officehour = new Officehour(officehours[i]);
        officehour = _.extend(officehour, officehours[i]);
        delete officehour._id;
        officehour._id = officehours[i]._id;
        console.log(officehour);

        for (var j = 0; j < officehour.comments.length; j++) {
          if (user._id.toString() === officehour.comments[j]._id.toString() && user.displayName !== officehour.comments[j].displayName) {
            officehour.comments[j].displayName = user.displayName;
            officehour.comments[j].profileImageURL = user.profileImageURL;
            console.log('updating user ' + user._id);
          }
        }

        officehour.update(errorCallback);
      }
    });
    */
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};

/**
 * Update profile picture
 */
exports.changeProfilePicture = function (req, res) {
  var user = req.user;
  var message = null;
  var upload = multer(config.uploads.profileUpload).single('newProfilePicture');
  var profileUploadFileFilter = require(path.resolve('./config/lib/multer')).profileUploadFileFilter;

  // Filtering to upload only images
  upload.fileFilter = profileUploadFileFilter;

  if (user) {
    upload(req, res, function (uploadError) {
      if(uploadError) {
        return res.status(400).send({
          message: 'Error occurred while uploading profile picture'
        });
      } else {
        user.profileImageURL = config.uploads.profileUpload.dest + req.file.filename;

        user.save(function (saveError) {
          if (saveError) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(saveError)
            });
          } else {
            req.login(user, function (err) {
              if (err) {
                res.status(400).send(err);
              } else {
                res.json(user);
              }
            });
          }
        });
      }
    });
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};

/**
 * Send User
 */
exports.me = function (req, res) {
  res.json(req.user || null);
};
