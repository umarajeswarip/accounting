'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Income Schema
 */
var IncomeSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Income name',
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

mongoose.model('Income', IncomeSchema);