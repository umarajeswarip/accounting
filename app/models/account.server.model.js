'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Article Schema
 */
var AccountSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	name: {
		type: String,
		default: '',
		trim: true,
		required: 'Name cannot be blank'
	},
    branch: {
        type: String,
        default: '',
        trim: true,
        required: 'Branch cannot be blank'
    },
    sortCode: {
        type: String,
        default: '',
        trim: true,
        required: 'Sortcode cannot be blank'
    },
    accountNumber: {
        type: String,
        default: '',
        trim: true,
        required: 'Account Number cannot be blank'
    },
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Account', AccountSchema);
