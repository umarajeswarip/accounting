'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Invoice Schema
 */
var InvoiceSchema = new Schema({
    organisation: {
        type: Schema.ObjectId,
        ref: 'Organisation'
    },
    account: {
        type: Schema.ObjectId,
        ref: 'Account'
    },
    invoiceDetails: [{
        startDate: {
            type: Date,
            required: 'Start date required'
        },
        endDate: {
            type: Date,
            required: 'End date required'
        },
        rate: {
            type: Number,
            required: 'Rate required'
        },
        noOfDays: {
            type: Number,
            required: 'No. of days required'
        },
        customer: {
            type: Schema.ObjectId,
            ref: 'Customer'
        }
    }],
    otherExpenses :[{
        rate: {
            type: Number
        }
    }],
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Invoice', InvoiceSchema);
