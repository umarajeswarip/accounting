'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
accounts = require('../../app/controllers/accounts.server.controller');

module.exports = function(app) {
	// Article Routes
	app.route('/accounts')
		.get(accounts.accountsList)
		.post(users.requiresLogin, accounts.accountCreate);

	app.route('/accounts/:accountId')
		.get(accounts.accountRead)
		.put(users.requiresLogin, accounts.accountHasAuthorization, accounts.accountUpdate)
		.delete(users.requiresLogin, accounts.accountHasAuthorization, accounts.accountDelete);

	// Finish by binding the article middleware
	app.param('accountId', accounts.accountByID);
};
