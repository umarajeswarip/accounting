'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Account = mongoose.model('Account'),
	_ = require('lodash');

/**
 * Create a article
 */
exports.accountCreate = function(req, res) {
	var account = new Article(req.body);
    account.user = req.user;

    account.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(account);
		}
	});
};

/**
 * Show the current article
 */
exports.accountRead = function(req, res) {
	res.json(req.account);
};

/**
 * Update a article
 */
exports.accountUpdate = function(req, res) {
	var account = req.account;

    account = _.extend(account, req.body);

    account.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(account);
		}
	});
};

/**
 * Delete an article
 */
exports.accountDelete = function(req, res) {
	var account = req.account;

	article.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(account);
		}
	});
};

/**
 * List of Articles
 */
exports.accountsList = function(req, res) {
	Account.find().sort('-created').populate('user', 'displayName').exec(function(err, accounts) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(accounts);
		}
	});
};

/**
 * Article middleware
 */
exports.accountByID = function(req, res, next, id) {
	Article.findById(id).populate('user', 'displayName').exec(function(err, account) {
		if (err) return next(err);
		if (!account) return next(new Error('Failed to load article ' + id));
		req.account = account;
		next();
	});
};

/**
 * Article authorization middleware
 */
exports.accountHasAuthorization = function(req, res, next) {
	if (req.account.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};
