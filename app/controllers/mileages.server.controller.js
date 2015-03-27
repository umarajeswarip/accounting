'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Mileage = mongoose.model('Mileage'),
	_ = require('lodash');

/**
 * Create a Mileage
 */
exports.create = function(req, res) {
	var mileage = new Mileage(req.body);
	mileage.user = req.user;

	mileage.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(mileage);
		}
	});
};

/**
 * Show the current Mileage
 */
exports.read = function(req, res) {
	res.jsonp(req.mileage);
};

/**
 * Update a Mileage
 */
exports.update = function(req, res) {
	var mileage = req.mileage ;

	mileage = _.extend(mileage , req.body);

	mileage.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(mileage);
		}
	});
};

/**
 * Delete an Mileage
 */
exports.delete = function(req, res) {
	var mileage = req.mileage ;

	mileage.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(mileage);
		}
	});
};

/**
 * List of Mileages
 */
exports.list = function(req, res) { 
	Mileage.find().sort('-created').populate('user', 'displayName').exec(function(err, mileages) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(mileages);
		}
	});
};

/**
 * Mileage middleware
 */
exports.mileageByID = function(req, res, next, id) { 
	Mileage.findById(id).populate('user', 'displayName').exec(function(err, mileage) {
		if (err) return next(err);
		if (! mileage) return next(new Error('Failed to load Mileage ' + id));
		req.mileage = mileage ;
		next();
	});
};

/**
 * Mileage authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.mileage.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
