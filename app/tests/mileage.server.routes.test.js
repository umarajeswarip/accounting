'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Mileage = mongoose.model('Mileage'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, mileage;

/**
 * Mileage routes tests
 */
describe('Mileage CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Mileage
		user.save(function() {
			mileage = {
				name: 'Mileage Name'
			};

			done();
		});
	});

	it('should be able to save Mileage instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Mileage
				agent.post('/mileages')
					.send(mileage)
					.expect(200)
					.end(function(mileageSaveErr, mileageSaveRes) {
						// Handle Mileage save error
						if (mileageSaveErr) done(mileageSaveErr);

						// Get a list of Mileages
						agent.get('/mileages')
							.end(function(mileagesGetErr, mileagesGetRes) {
								// Handle Mileage save error
								if (mileagesGetErr) done(mileagesGetErr);

								// Get Mileages list
								var mileages = mileagesGetRes.body;

								// Set assertions
								(mileages[0].user._id).should.equal(userId);
								(mileages[0].name).should.match('Mileage Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Mileage instance if not logged in', function(done) {
		agent.post('/mileages')
			.send(mileage)
			.expect(401)
			.end(function(mileageSaveErr, mileageSaveRes) {
				// Call the assertion callback
				done(mileageSaveErr);
			});
	});

	it('should not be able to save Mileage instance if no name is provided', function(done) {
		// Invalidate name field
		mileage.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Mileage
				agent.post('/mileages')
					.send(mileage)
					.expect(400)
					.end(function(mileageSaveErr, mileageSaveRes) {
						// Set message assertion
						(mileageSaveRes.body.message).should.match('Please fill Mileage name');
						
						// Handle Mileage save error
						done(mileageSaveErr);
					});
			});
	});

	it('should be able to update Mileage instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Mileage
				agent.post('/mileages')
					.send(mileage)
					.expect(200)
					.end(function(mileageSaveErr, mileageSaveRes) {
						// Handle Mileage save error
						if (mileageSaveErr) done(mileageSaveErr);

						// Update Mileage name
						mileage.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Mileage
						agent.put('/mileages/' + mileageSaveRes.body._id)
							.send(mileage)
							.expect(200)
							.end(function(mileageUpdateErr, mileageUpdateRes) {
								// Handle Mileage update error
								if (mileageUpdateErr) done(mileageUpdateErr);

								// Set assertions
								(mileageUpdateRes.body._id).should.equal(mileageSaveRes.body._id);
								(mileageUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Mileages if not signed in', function(done) {
		// Create new Mileage model instance
		var mileageObj = new Mileage(mileage);

		// Save the Mileage
		mileageObj.save(function() {
			// Request Mileages
			request(app).get('/mileages')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Mileage if not signed in', function(done) {
		// Create new Mileage model instance
		var mileageObj = new Mileage(mileage);

		// Save the Mileage
		mileageObj.save(function() {
			request(app).get('/mileages/' + mileageObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', mileage.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Mileage instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Mileage
				agent.post('/mileages')
					.send(mileage)
					.expect(200)
					.end(function(mileageSaveErr, mileageSaveRes) {
						// Handle Mileage save error
						if (mileageSaveErr) done(mileageSaveErr);

						// Delete existing Mileage
						agent.delete('/mileages/' + mileageSaveRes.body._id)
							.send(mileage)
							.expect(200)
							.end(function(mileageDeleteErr, mileageDeleteRes) {
								// Handle Mileage error error
								if (mileageDeleteErr) done(mileageDeleteErr);

								// Set assertions
								(mileageDeleteRes.body._id).should.equal(mileageSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Mileage instance if not signed in', function(done) {
		// Set Mileage user 
		mileage.user = user;

		// Create new Mileage model instance
		var mileageObj = new Mileage(mileage);

		// Save the Mileage
		mileageObj.save(function() {
			// Try deleting Mileage
			request(app).delete('/mileages/' + mileageObj._id)
			.expect(401)
			.end(function(mileageDeleteErr, mileageDeleteRes) {
				// Set message assertion
				(mileageDeleteRes.body.message).should.match('User is not logged in');

				// Handle Mileage error error
				done(mileageDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Mileage.remove().exec();
		done();
	});
});