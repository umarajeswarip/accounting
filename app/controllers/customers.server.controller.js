'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    ObjectID = require('mongodb').ObjectID,
	errorHandler = require('./errors.server.controller'),
	Customer = mongoose.model('Customer'),
    Organisation = mongoose.model('Organisation'),
    Account = mongoose.model('Account'),
    Invoice = mongoose.model('Invoice'),
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
            var invoice = new Invoice( {
                organisation: new ObjectID.createFromHexString('54e5b9dcb730d0e81c4e1e29'),
                account: new ObjectID.createFromHexString('54e5ce8b9065b9d8287c47b1'),
                invoiceDetails: [{
                    startDate: Date.now(),
                    endDate: Date.now(),
                    noOfDays: 10,
                    rate: 100,
                    customer:new ObjectID.createFromHexString('54d22e09fb082ff8085d2a93')
            }]
            });
            invoice.save(function(err) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                }
                res.json(customer);
            });
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
    Invoice.findById( new ObjectID.createFromHexString('54e5f6d55d74bb9c260659e9')).populate('organisation').populate('account').exec(function(err, invoice) {
        if (err) return next(err);
        if (! invoice) return next(new Error('Failed to load invoice 54e5b9dcb730d0e81c4e1e29'));
        console.log(invoice);
        console.log(invoice.organisation);
        console.log(invoice.account);
        Customer.findById(id).populate('user', 'displayName').exec(function(err, customer) {
            if (err) return next(err);
            if (!customer) return next(new Error('Failed to load customer ' + id));
            req.customer = customer;
            next();
        });
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
