'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Mileage Schema
 */
var MileageSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Mileage name',
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

mongoose.model('Mileage', MileageSchema);