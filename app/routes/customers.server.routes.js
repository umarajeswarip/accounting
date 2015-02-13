'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
customers = require('../../app/controllers/customers.server.controller');

module.exports = function(app) {
	// Article Routes
	app.route('/customers')
		.get(customers.customerList)
		.post(users.requiresLogin, customers.customerCreate);

	app.route('/customers/:customerId')
		.get(customers.customerRead)
		.put(users.requiresLogin, customers.customerHasAuthorization, customers.customerUpdate)
		.delete(users.requiresLogin, customers.customerHasAuthorization, customers.customerDelete);

	// Finish by binding the article middleware
	app.param('customerId', customers.customerByID);
};
