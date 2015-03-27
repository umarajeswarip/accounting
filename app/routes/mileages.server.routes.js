'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var mileages = require('../../app/controllers/mileages.server.controller');

	// Mileages Routes
	app.route('/mileages')
		.get(mileages.list)
		.post(users.requiresLogin, mileages.create);

	app.route('/mileages/:mileageId')
		.get(mileages.read)
		.put(users.requiresLogin, mileages.hasAuthorization, mileages.update)
		.delete(users.requiresLogin, mileages.hasAuthorization, mileages.delete);

	// Finish by binding the Mileage middleware
	app.param('mileageId', mileages.mileageByID);
};
