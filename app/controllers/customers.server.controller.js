'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Customer = mongoose.model('Customer'),
	_ = require('lodash');

/**
 * Create a article
 */
exports.customerCreate = function(req, res) {
	var customer = new Customer(req.body);
	customer.user = req.user;

    customer.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(customer);
		}
	});
};

/**
 * Show the current article
 */
exports.customerRead = function(req, res) {
	res.json(req.customer);
};

/**
 * Update a article
 */
exports.customerUpdate = function(req, res) {
	var customer = req.customer;

    customer = _.extend(customer, req.body);

    customer.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(customer);
		}
	});
};

/**
 * Delete an article
 */
exports.customerDelete = function(req, res) {
	var customer = req.customer;

    customer.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(customer);
		}
	});
};

/**
 * List of Articles
 */
exports.customerList = function(req, res) {
	Customer.find().sort('-created').populate('user', 'displayName').exec(function(err, customers) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(customers);
		}
	});
};

/**
 * Article middleware
 */
exports.customerByID = function(req, res, next, id) {
	Customer.findById(id).populate('user', 'displayName').exec(function(err, customer) {
		if (err) return next(err);
		if (!customer) return next(new Error('Failed to load customer ' + id));
		req.customer = customer;
		next();
	});
};

/**
 * Article authorization middleware
 */
exports.customerHasAuthorization = function(req, res, next) {
	if (req.customer.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};
