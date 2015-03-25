'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Employee Schema
 */
var EmployeeSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Employee name',
		trim: true
	},
    position: {
        type: String,
        default: '',
        required: 'Please fill Employee Position',
        trim: true
    },
    salary: {
        type: Number,
        default: '',
        required: 'Please fill Salary',
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

mongoose.model('Employee', EmployeeSchema);
