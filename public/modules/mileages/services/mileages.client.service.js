'use strict';

//Mileages service used to communicate Mileages REST endpoints
angular.module('mileages').factory('Mileages', ['$resource',
	function($resource) {
		return $resource('mileages/:mileageId', { mileageId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);