'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Officehour = mongoose.model('Officehour'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, officehour;

/**
 * Officehour routes tests
 */
describe('Officehour CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
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

    // Save a user to the test db and create new Officehour
    user.save(function () {
      officehour = {
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
      };

      done();
    });
  });

  it('should be able to save a Officehour if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Officehour
        agent.post('/api/officehours')
          .send(officehour)
          .expect(200)
          .end(function (officehourSaveErr, officehourSaveRes) {
            // Handle Officehour save error
            if (officehourSaveErr) {
              return done(officehourSaveErr);
            }

            // Get a list of Officehours
            agent.get('/api/officehours')
              .end(function (officehoursGetErr, officehoursGetRes) {
                // Handle Officehour save error
                if (officehoursGetErr) {
                  return done(officehoursGetErr);
                }

                // Get Officehours list
                var officehours = officehoursGetRes.body;

                // Set assertions
                (officehours[0].user._id).should.equal(userId);
                (officehours[0].name).should.match('Officehour name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Officehour if not logged in', function (done) {
    agent.post('/api/officehours')
      .send(officehour)
      .expect(403)
      .end(function (officehourSaveErr, officehourSaveRes) {
        // Call the assertion callback
        done(officehourSaveErr);
      });
  });

  it('should not be able to save an Officehour if no location is provided', function (done) {
    // Invalidate location field
    officehour.location = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Officehour
        agent.post('/api/officehours')
          .send(officehour)
          .expect(400)
          .end(function (officehourSaveErr, officehourSaveRes) {
            // Set message assertion
            (officehourSaveRes.body.message).should.match('Please enter a valid location for this office hour, like BA3200, for example.');

            // Handle Officehour save error
            done(officehourSaveErr);
          });
      });
  });

  it('should not be able to save an Officehour if no time is provided', function (done) {
    // Invalidate location field
    officehour.time = null;

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Officehour
        agent.post('/api/officehours')
          .send(officehour)
          .expect(400)
          .end(function (officehourSaveErr, officehourSaveRes) {
            // Set message assertion
            (officehourSaveRes.body.message).should.match('Please fill Officehour name');

            // Handle Officehour save error
            done(officehourSaveErr);
          });
      });
  });

  it('should be able to update an Officehour if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Officehour
        agent.post('/api/officehours')
          .send(officehour)
          .expect(200)
          .end(function (officehourSaveErr, officehourSaveRes) {
            // Handle Officehour save error
            if (officehourSaveErr) {
              return done(officehourSaveErr);
            }

            // Update Officehour name
            officehour.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Officehour
            agent.put('/api/officehours/' + officehourSaveRes.body._id)
              .send(officehour)
              .expect(200)
              .end(function (officehourUpdateErr, officehourUpdateRes) {
                // Handle Officehour update error
                if (officehourUpdateErr) {
                  return done(officehourUpdateErr);
                }

                // Set assertions
                (officehourUpdateRes.body._id).should.equal(officehourSaveRes.body._id);
                (officehourUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Officehours if not signed in', function (done) {
    // Create new Officehour model instance
    var officehourObj = new Officehour(officehour);

    // Save the officehour
    officehourObj.save(function () {
      // Request Officehours
      request(app).get('/api/officehours')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Officehour if not signed in', function (done) {
    // Create new Officehour model instance
    var officehourObj = new Officehour(officehour);

    // Save the Officehour
    officehourObj.save(function () {
      request(app).get('/api/officehours/' + officehourObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', officehour.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Officehour with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/officehours/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Officehour is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Officehour which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Officehour
    request(app).get('/api/officehours/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Officehour with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Officehour if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Officehour
        agent.post('/api/officehours')
          .send(officehour)
          .expect(200)
          .end(function (officehourSaveErr, officehourSaveRes) {
            // Handle Officehour save error
            if (officehourSaveErr) {
              return done(officehourSaveErr);
            }

            // Delete an existing Officehour
            agent.delete('/api/officehours/' + officehourSaveRes.body._id)
              .send(officehour)
              .expect(200)
              .end(function (officehourDeleteErr, officehourDeleteRes) {
                // Handle officehour error error
                if (officehourDeleteErr) {
                  return done(officehourDeleteErr);
                }

                // Set assertions
                (officehourDeleteRes.body._id).should.equal(officehourSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Officehour if not signed in', function (done) {
    // Set Officehour user
    officehour.user = user;

    // Create new Officehour model instance
    var officehourObj = new Officehour(officehour);

    // Save the Officehour
    officehourObj.save(function () {
      // Try deleting Officehour
      request(app).delete('/api/officehours/' + officehourObj._id)
        .expect(403)
        .end(function (officehourDeleteErr, officehourDeleteRes) {
          // Set message assertion
          (officehourDeleteRes.body.message).should.match('User is not authorized');

          // Handle Officehour error error
          done(officehourDeleteErr);
        });

    });
  });

  it('should be able to get a single Officehour that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Officehour
          agent.post('/api/officehours')
            .send(officehour)
            .expect(200)
            .end(function (officehourSaveErr, officehourSaveRes) {
              // Handle Officehour save error
              if (officehourSaveErr) {
                return done(officehourSaveErr);
              }

              // Set assertions on new Officehour
              (officehourSaveRes.body.name).should.equal(officehour.name);
              should.exist(officehourSaveRes.body.user);
              should.equal(officehourSaveRes.body.user._id, orphanId);

              // force the Officehour to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Officehour
                    agent.get('/api/officehours/' + officehourSaveRes.body._id)
                      .expect(200)
                      .end(function (officehourInfoErr, officehourInfoRes) {
                        // Handle Officehour error
                        if (officehourInfoErr) {
                          return done(officehourInfoErr);
                        }

                        // Set assertions
                        (officehourInfoRes.body._id).should.equal(officehourSaveRes.body._id);
                        (officehourInfoRes.body.name).should.equal(officehour.name);
                        should.equal(officehourInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Officehour.remove().exec(done);
    });
  });
});
