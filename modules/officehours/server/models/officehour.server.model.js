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
  class: {
    type: String,
    default: '',
    required: 'Please select a valid course for this office hour, for example CSC309.',
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
    required: 'Please select a time for this office hour.'
  },
  length : {
    type: Number,
    default: 1
  },
  professor : {
    type: Schema.ObjectId,
    ref: 'User',
    default: null
  },
  professorName : {
    type: String,
    default: ''
  },
  tas : {
    type: Array,
    default: []
  },
  location : {
    type: String,
    default: '',
    required: 'Please enter a valid location for this office hour, like BA3200, for example.'
  },
  students: {
    type: Array,
    default: []
  },
  comments: {
    type: Array,
    default: []
  }
});

mongoose.model('Officehour', OfficehourSchema);
