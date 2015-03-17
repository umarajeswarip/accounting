'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize();

/**
 * Invoice Schema
 */
var InvoiceSchema = new Schema({
    organisation: {
        type: String,
        ref: 'Organisation'
    },
    account: {
        type: String,
        ref: 'Account'
    },
    invoiceDate: {
        type: Date,
        ref: 'Invoice date required'
    },
    total: {
        type: Number,
        ref: 'Total required'
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
        total: {
            type: Number,
            required: 'Total required'
        },
        noOfDays: {
            type: Number,
            required: 'No. of days required'
        },
        customer: {
            name: {
                type: String,
                required: 'Customer Name required'
            },
            id: {
                type: String,
                ref: 'Customer'
            }
        }
    }],
    otherExpenses :{
        type: Number
    },
    vat: {
        type: Number,
        ref: 'Vat required'
    },
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

InvoiceSchema.plugin(autoIncrement.plugin, { model: 'Invoice', field: 'invoiceNumber' });

mongoose.model('Invoice', InvoiceSchema);
