'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Officehour = mongoose.model('Officehour');

/**
 * Globals
 */
var user, officehour;

/**
 * Unit tests
 */
describe('Officehour Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password',
      classes: ['CSC108'],
      typeOfUser: 'professor',
      description: 'Test user!'
    });

    user.save(function() { 
      officehour = new Officehour({
        user: user,
        time: new Date(),
        comments: [],
        students: [user],
        class: 'CSC108',
        tas: [],
        created: new Date(),
        professor: null,
        professorName: '',
        location: 'BA3200',
        length: 1
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return officehour.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without time', function(done) { 
      officehour.time = null;

      return officehour.save(function(err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without location', function(done) { 
      officehour.location = '';

      return officehour.save(function(err) {
        should.exist(err);
        done();
      });
    });

  });

  afterEach(function(done) { 
    Officehour.remove().exec(function(){
      User.remove().exec(function(){
        done();  
      });
    });
  });
});
