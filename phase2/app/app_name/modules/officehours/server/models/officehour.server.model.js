'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Officehour Schema
 */
var OfficehourSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please select a class for this office hour.',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  time: {
    type: Date,
    default: Date.now,
    required: 'Please select a time for this office hour.'
  },
  professor : {
    type: String
  },
  tas : {
    type: Array,
    default: []
  },
  location : {
    type: String,
    default: '',
    required: 'Please enter a time for this office hour.'
  },
  students: {
    type: Array,
    default: []
  }
});

mongoose.model('Officehour', OfficehourSchema);
