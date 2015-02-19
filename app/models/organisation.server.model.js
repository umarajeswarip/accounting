'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Organisation Schema
 */
var OrganisationSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Organisation name',
		trim: true
	},
    companyNumber: {
        type: String,
        required: 'Please fill Company Reg. Number',
        trim: true
    },
    address : {
        addressLine1 :
        {
            type: String,
            required: 'Address line 1 Required',
            trim: true
        },
        addressLine2: {
            type: String,
            trim: true
        },
        city: {
            type: String,
            required: 'City Required',
            trim: true
        },
        country: {
            type: String,
            required: 'Country Required',
            trim: true
        },
        postCode: {
            type: String,
            required: 'Post code Required',
            trim: true
        }
    },
    vatNumber: {
        type: String,
        required: 'Please fill VAT Number',
        trim: true
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

mongoose.model('Organisation', OrganisationSchema);
