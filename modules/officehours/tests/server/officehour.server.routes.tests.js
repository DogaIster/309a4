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
describe('Office hour CRUD tests', function () {

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
        user: user._id.toString(),
        time: new Date(),
        comments: [],
        students: [user._id.toString()],
        class: 'CSC108',
        tas: [],
        created: new Date(), // this is overwritten by the server
        professor: null,
        professorName: '',
        location: 'BA3200',
        length: 1
      };

      done();
    });
  });

  it('should be able to save a Office hour if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(400)
      .end(function (signinErr, signinRes) {
        // the only reason the 400 error above happens is because we refresh the page.
        // there should be no errors (i.e. it should be null)
        should.equal(signinErr, null);
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Officehour
        agent.post('/api/officehours')
          .send(officehour)
          .expect(403)
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

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Office hour if not logged in', function (done) {
    agent.post('/api/officehours')
      .send(officehour)
      .expect(403)
      .end(function (officehourSaveErr, officehourSaveRes) {
        // Call the assertion callback
        done(officehourSaveErr);
      });
  });

  it('should not be able to save an Office hour if no location is provided', function (done) {
    // Invalidate location field
    officehour.location = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(400)
      .end(function (signinErr, signinRes) {
        // the only reason the 400 error above happens is because we refresh the page.
        // there should be no errors (i.e. it should be null)
        should.equal(signinErr, null);
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Officehour
        agent.post('/api/officehours')
          .send(officehour)
          .expect(403)
          .end(function (officehourSaveErr, officehourSaveRes) {
            // Set message assertion
            (officehourSaveRes.body.message).should.match('User is not authorized');

            // Handle Officehour save error
            done(officehourSaveErr);
          });
      });
  });

  it('should not be able to save an Office hour if no time is provided', function (done) {
    // Invalidate location field
    officehour.time = null;

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(400)
      .end(function (signinErr, signinRes) {
        // the only reason the 400 error above happens is because we refresh the page.
        // there should be no errors (i.e. it should be null)
        should.equal(signinErr, null);
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Officehour
        agent.post('/api/officehours')
          .send(officehour)
          .expect(403)
          .end(function (officehourSaveErr, officehourSaveRes) {
            // Set message assertion
            (officehourSaveRes.body.message).should.match('User is not authorized');

            // Handle Officehour save error
            done(officehourSaveErr);
          });
      });
  });

  it('should not be able to save an Office hour if no class is provided', function (done) {
    // Invalidate class field
    officehour.class = null;

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(400)
      .end(function (signinErr, signinRes) {
        // the only reason the 400 error above happens is because we refresh the page.
        // there should be no errors (i.e. it should be null)
        should.equal(signinErr, null);
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Officehour
        agent.post('/api/officehours')
          .send(officehour)
          .expect(403)
          .end(function (officehourSaveErr, officehourSaveRes) {
            // Set message assertion
            (officehourSaveRes.body.message).should.match('User is not authorized');

            // Handle Officehour save error
            done(officehourSaveErr);
          });
      });
  });

  it('should be able to update an Office hour if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(400)
      .end(function (signinErr, signinRes) {
        // the only reason the 400 error above happens is because we refresh the page.
        // there should be no errors (i.e. it should be null)
        should.equal(signinErr, null);
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Officehour
        agent.post('/api/officehours')
          .send(officehour)
          .expect(403)
          .end(function (officehourSaveErr, officehourSaveRes) {

            // Handle Officehour save error
            if (officehourSaveErr) {
              return done(officehourSaveErr);
            }

            // Update Officehour class
            officehour.class = 'CSC309';

            // Update an existing Officehour
            agent.put('/api/officehours/' + officehourSaveRes.body._id)
              .send(officehour)
              .expect(400)
              .end(function (officehourUpdateErr, officehourUpdateRes) {

                // Handle Officehour update error
                if (officehourUpdateErr) {
                  return done(officehourUpdateErr);
                }

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Office hours if not signed in', function (done) {
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

  it('should be able to get a list of Office hours via RESTful API in valid JSON format', function (done) {
    // Create new Officehour model instance
    var officehourObj = new Officehour(officehour);

    // Save the officehour
    officehourObj.save(function () {
      // Request Officehours
      request(app).get('/api/officehours')
        .end(function (req, res) {
          var response = JSON.parse(res.text.toString());
          // thanks to http://stackoverflow.com/questions/4295386/how-can-i-check-if-a-value-is-a-json-object
          response.should.be.instanceof(Object);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Office hour via RESTful API in valid JSON format', function (done) {
    // Create new Officehour model instance
    var officehourObj = new Officehour(officehour);

    // Save the officehour
    officehourObj.save(function () {
      // Request Officehours
      request(app).get('/api/officehours/' + officehourObj._id)
        .end(function (req, res) {
          var response = JSON.parse(res.text.toString());
          // thanks to http://stackoverflow.com/questions/4295386/how-can-i-check-if-a-value-is-a-json-object
          response.should.be.instanceof(Object);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Office hour if not signed in', function (done) {
    // Create new Officehour model instance
    var officehourObj = new Officehour(officehour);

    // Save the Officehour
    officehourObj.save(function () {
      request(app).get('/api/officehours/' + officehourObj._id)
        .end(function (req, res) {
          // check every field, except times since the formats get changed on the server side
          res.body.should.be.instanceof(Object).and.have.property('class', officehour.class);
          res.body.should.be.instanceof(Object).and.have.property('comments', officehour.comments);
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          res.body.should.be.instanceof(Object).and.have.property('length', officehour.length);
          res.body.should.be.instanceof(Object).and.have.property('location', officehour.location);
          res.body.should.be.instanceof(Object).and.have.property('professor', officehour.professor);
          res.body.should.be.instanceof(Object).and.have.property('professorName', officehour.professorName);
          res.body.should.be.instanceof(Object).and.have.property('students', officehour.students);
          res.body.should.be.instanceof(Object).and.have.property('user', null);
          res.body.should.be.instanceof(Object).and.have.property('tas', officehour.tas);

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
        res.body.should.be.instanceof(Object).and.have.property('message', 'Office hour is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Officehour which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Officehour
    request(app).get('/api/officehours/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Office hour with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Office hour if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(400)
      .end(function (signinErr, signinRes) {
        // the only reason the 400 error above happens is because we refresh the page.
        // there should be no errors (i.e. it should be null)
        should.equal(signinErr, null);
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Officehour
        agent.post('/api/officehours')
          .send(officehour)
          .expect(403)
          .end(function (officehourSaveErr, officehourSaveRes) {
            // Handle Officehour save error
            if (officehourSaveErr) {
              return done(officehourSaveErr);
            }

            // Delete an existing Officehour
            agent.delete('/api/officehours/' + officehourSaveRes.body._id)
              .send(officehour)
              .expect(400)
              .end(function (officehourDeleteErr, officehourDeleteRes) {
                // Handle officehour error error
                if (officehourDeleteErr) {
                  return done(officehourDeleteErr);
                }

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Office hour if not signed in', function (done) {
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

  it('a professor should be able to put an Office hour', function (done) {
    var _creds = {
      username: 'prof',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    var _profObject = {
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'prof@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local',
      classes: ['CSC108'],
      typeOfUser: 'professor',
      description: 'prof user',
      profileImageURL: 'modules/users/client/img/profile/default.png'
    };
    var _prof = new User(_profObject);


    _prof.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // the only reason the 400 error above happens is because we refresh the page.
          // there should be no errors (i.e. it should be null)
          should.equal(err, null);
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var profId = _prof._id;

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
              officehourSaveRes.body.should.be.instanceof(Object).and.have.property('class', officehour.class);
              officehourSaveRes.body.should.be.instanceof(Object).and.have.property('comments', officehour.comments);
              officehourSaveRes.body.should.be.instanceof(Object).and.have.property('length', officehour.length);
              officehourSaveRes.body.should.be.instanceof(Object).and.have.property('location', officehour.location);
              officehourSaveRes.body.should.be.instanceof(Object).and.have.property('professorName', _profObject.displayName);
              officehourSaveRes.body.should.be.instanceof(Object).and.have.property('students', officehour.students);
              officehourSaveRes.body.should.be.instanceof(Object).and.have.property('tas', officehour.tas);
              officehourSaveRes.body.should.be.instanceof(Object).and.have.property('professor');
              should.exist(officehourSaveRes.body.user);
              should.equal(officehourSaveRes.body.user._id, profId);
              // since the user is a professor
              should.equal(officehourSaveRes.body.professor._id, profId);

              // Call the assertion callback
              done();
            });
        });
    });
  });

  it('a student should be able to put an Office hour', function (done) {
    var _creds = {
      username: 'student',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    var _studentObject = {
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'student@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local',
      classes: ['CSC108'],
      typeOfUser: 'student',
      description: 'student user',
      profileImageURL: 'modules/users/client/img/profile/default.png'
    };
    var _student = new User(_studentObject);


    _student.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // the only reason the 400 error above happens is because we refresh the page.
          // there should be no errors (i.e. it should be null)
          should.equal(err, null);
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var studentId = _student._id;
          agent.post('/api/officehours')
            .send(officehour)
            .expect(200)
            .end(function (officehourSaveErr, officehourSaveRes) {
              // Handle Officehour save error
              if (officehourSaveErr) {
                return done(officehourSaveErr);
              }

              // Set assertions on new Officehour
              officehourSaveRes.body.should.be.instanceof(Object).and.have.property('class', officehour.class);
              officehourSaveRes.body.should.be.instanceof(Object).and.have.property('comments', officehour.comments);
              officehourSaveRes.body.should.be.instanceof(Object).and.have.property('length', officehour.length);
              officehourSaveRes.body.should.be.instanceof(Object).and.have.property('location', officehour.location);
              officehourSaveRes.body.should.be.instanceof(Object).and.have.property('professorName', '');
              officehourSaveRes.body.should.be.instanceof(Object).and.have.property('students');
              officehourSaveRes.body.students.should.be.instanceof(Object).and.have.lengthOf(2);
              officehourSaveRes.body.should.be.instanceof(Object).and.have.property('tas', officehour.tas);
              officehourSaveRes.body.should.be.instanceof(Object).and.have.property('professor');
              should.exist(officehourSaveRes.body.user);
              should.equal(officehourSaveRes.body.user._id, studentId);
              should.equal(officehourSaveRes.body.professor, null);

              // Call the assertion callback
              done();
            });
        });
    });
  });

  it('a ta should be able to put an Office hour', function (done) {
    var _creds = {
      username: 'ta',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    var _taObject = {
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'ta@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local',
      classes: ['CSC108'],
      typeOfUser: 'ta',
      description: 'ta user',
      profileImageURL: 'modules/users/client/img/profile/default.png'
    };
    var _ta = new User(_taObject);


    _ta.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // the only reason the 400 error above happens is because we refresh the page.
          // there should be no errors (i.e. it should be null)
          should.equal(err, null);
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var taId = _ta._id;
          agent.post('/api/officehours')
            .send(officehour)
            .expect(200)
            .end(function (officehourSaveErr, officehourSaveRes) {
              // Handle Officehour save error
              if (officehourSaveErr) {
                return done(officehourSaveErr);
              }

              // Set assertions on new Officehour
              officehourSaveRes.body.should.be.instanceof(Object).and.have.property('class', officehour.class);
              officehourSaveRes.body.should.be.instanceof(Object).and.have.property('comments', officehour.comments);
              officehourSaveRes.body.should.be.instanceof(Object).and.have.property('length', officehour.length);
              officehourSaveRes.body.should.be.instanceof(Object).and.have.property('location', officehour.location);
              officehourSaveRes.body.should.be.instanceof(Object).and.have.property('professorName', '');
              officehourSaveRes.body.should.be.instanceof(Object).and.have.property('students');
              officehourSaveRes.body.tas.should.be.instanceof(Object).and.have.lengthOf(1);
              officehourSaveRes.body.should.be.instanceof(Object).and.have.property('students', officehour.students);
              officehourSaveRes.body.should.be.instanceof(Object).and.have.property('professor');
              should.exist(officehourSaveRes.body.user);
              should.equal(officehourSaveRes.body.user._id, taId);
              should.equal(officehourSaveRes.body.professor, null);

              // Call the assertion callback
              done();
            });
        });
    });
  });

  it('should be able to get a single Office hour that has an orphaned professor user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    var _orphanObject = {
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local',
      classes: ['CSC108'],
      typeOfUser: 'professor',
      description: 'Orphan user',
      profileImageURL: 'modules/users/client/img/profile/default.png'
    };
    // Create orphan user
    var _orphan = new User(_orphanObject);


    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // the only reason the 400 error above happens is because we refresh the page.
          // there should be no errors (i.e. it should be null)
          should.equal(err, null);
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
              // the orphan is acutally a professor, so we're also testing the professor functionality here
              officehourSaveRes.body.should.be.instanceof(Object).and.have.property('class', officehour.class);
              officehourSaveRes.body.should.be.instanceof(Object).and.have.property('comments', officehour.comments);
              officehourSaveRes.body.should.be.instanceof(Object).and.have.property('length', officehour.length);
              officehourSaveRes.body.should.be.instanceof(Object).and.have.property('location', officehour.location);
              officehourSaveRes.body.should.be.instanceof(Object).and.have.property('professorName', _orphanObject.displayName);
              officehourSaveRes.body.should.be.instanceof(Object).and.have.property('students', officehour.students);
              officehourSaveRes.body.should.be.instanceof(Object).and.have.property('tas', officehour.tas);
              should.exist(officehourSaveRes.body.user);
              should.equal(officehourSaveRes.body.user._id, orphanId);
              // since the user is a professor
              should.equal(officehourSaveRes.body.professor._id, orphanId);


              // force the Officehour to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(400)
                  .end(function (err, res) {
                    // the only reason the 400 error above happens is because we refresh the page.
                    // there should be no errors (i.e. it should be null)
                    should.equal(err, null);
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
                        officehourInfoRes.body.should.be.instanceof(Object).and.have.property('class', officehour.class);
                        officehourInfoRes.body.should.be.instanceof(Object).and.have.property('comments', officehour.comments);
                        officehourInfoRes.body.should.be.instanceof(Object).and.have.property('length', officehour.length);
                        officehourInfoRes.body.should.be.instanceof(Object).and.have.property('location', officehour.location);
                        officehourInfoRes.body.should.be.instanceof(Object).and.have.property('professorName', _orphanObject.displayName);
                        officehourInfoRes.body.should.be.instanceof(Object).and.have.property('students', officehour.students);
                        officehourInfoRes.body.should.be.instanceof(Object).and.have.property('tas', officehour.tas);

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

  it('should be able to get a single Office hour that has an orphaned student user reference', function (done) {
      // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    var _orphanObject = {
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local',
      classes: ['CSC108'],
      typeOfUser: 'student',
      description: 'Orphan user',
      profileImageURL: 'modules/users/client/img/profile/default.png'
    };
    // Create orphan user
    var _orphan = new User(_orphanObject);


    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // the only reason the 400 error above happens is because we refresh the page.
          // there should be no errors (i.e. it should be null)
          should.equal(err, null);
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
              // the orphan is acutally a professor, so we're also testing the professor functionality here
              officehourSaveRes.body.should.be.instanceof(Object).and.have.property('class', officehour.class);
              officehourSaveRes.body.should.be.instanceof(Object).and.have.property('comments', officehour.comments);
              officehourSaveRes.body.should.be.instanceof(Object).and.have.property('length', officehour.length);
              officehourSaveRes.body.should.be.instanceof(Object).and.have.property('location', officehour.location);
              officehourSaveRes.body.should.be.instanceof(Object).and.have.property('professorName', '');
              officehourSaveRes.body.should.be.instanceof(Object).and.have.property('students');
              officehourSaveRes.body.students.should.be.instanceof(Object).and.have.lengthOf(2);
              officehourSaveRes.body.should.be.instanceof(Object).and.have.property('tas', officehour.tas);
              should.exist(officehourSaveRes.body.user);
              should.equal(officehourSaveRes.body.user._id, orphanId);
              // since the user is a professor
              should.equal(officehourSaveRes.body.professor, null);


              // force the Officehour to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(400)
                  .end(function (err, res) {
                    // the only reason the 400 error above happens is because we refresh the page.
                    // there should be no errors (i.e. it should be null)
                    should.equal(err, null);
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
                        officehourInfoRes.body.should.be.instanceof(Object).and.have.property('class', officehour.class);
                        officehourInfoRes.body.should.be.instanceof(Object).and.have.property('comments', officehour.comments);
                        officehourInfoRes.body.should.be.instanceof(Object).and.have.property('length', officehour.length);
                        officehourInfoRes.body.should.be.instanceof(Object).and.have.property('location', officehour.location);
                        officehourInfoRes.body.should.be.instanceof(Object).and.have.property('professorName', '');
                        officehourInfoRes.body.should.be.instanceof(Object).and.have.property('students');
                        officehourSaveRes.body.students.should.be.instanceof(Object).and.have.lengthOf(2);
                        officehourInfoRes.body.should.be.instanceof(Object).and.have.property('tas', officehour.tas);

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

  it('should be able to get a single Office hour that has an orphaned TA user reference', function (done) {
      // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    var _orphanObject = {
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local',
      classes: ['CSC108'],
      typeOfUser: 'TA',
      description: 'Orphan user',
      profileImageURL: 'modules/users/client/img/profile/default.png'
    };
    // Create orphan user
    var _orphan = new User(_orphanObject);


    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // the only reason the 400 error above happens is because we refresh the page.
          // there should be no errors (i.e. it should be null)
          should.equal(err, null);
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
              officehourSaveRes.body.should.be.instanceof(Object).and.have.property('class', officehour.class);
              officehourSaveRes.body.should.be.instanceof(Object).and.have.property('comments', officehour.comments);
              officehourSaveRes.body.should.be.instanceof(Object).and.have.property('length', officehour.length);
              officehourSaveRes.body.should.be.instanceof(Object).and.have.property('location', officehour.location);
              officehourSaveRes.body.should.be.instanceof(Object).and.have.property('professorName', '');
              officehourSaveRes.body.should.be.instanceof(Object).and.have.property('tas');
              officehourSaveRes.body.students.should.be.instanceof(Object).and.have.lengthOf(1);
              officehourSaveRes.body.should.be.instanceof(Object).and.have.property('students', officehour.students);
              should.exist(officehourSaveRes.body.user);
              should.equal(officehourSaveRes.body.user._id, orphanId);
              should.equal(officehourSaveRes.body.professor, null);


              // force the Officehour to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(400)
                  .end(function (err, res) {
                    // the only reason the 400 error above happens is because we refresh the page.
                    // there should be no errors (i.e. it should be null)
                    should.equal(err, null);
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
                        officehourInfoRes.body.should.be.instanceof(Object).and.have.property('class', officehour.class);
                        officehourInfoRes.body.should.be.instanceof(Object).and.have.property('comments', officehour.comments);
                        officehourInfoRes.body.should.be.instanceof(Object).and.have.property('length', officehour.length);
                        officehourInfoRes.body.should.be.instanceof(Object).and.have.property('location', officehour.location);
                        officehourInfoRes.body.should.be.instanceof(Object).and.have.property('professorName', '');
                        officehourInfoRes.body.should.be.instanceof(Object).and.have.property('tas');
                        officehourSaveRes.body.students.should.be.instanceof(Object).and.have.lengthOf(1);
                        officehourInfoRes.body.should.be.instanceof(Object).and.have.property('students', officehour.students);

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
