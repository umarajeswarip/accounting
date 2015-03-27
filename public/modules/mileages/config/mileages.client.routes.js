'use strict';

//Setting up route
angular.module('mileages').config(['$stateProvider',
	function($stateProvider) {
		// Mileages state routing
		$stateProvider.
		state('listMileages', {
			url: '/mileages',
			templateUrl: 'modules/mileages/views/list-mileages.client.view.html'
		}).
		state('createMileage', {
			url: '/mileages/create',
			templateUrl: 'modules/mileages/views/create-mileage.client.view.html'
		}).
		state('viewMileage', {
			url: '/mileages/:mileageId',
			templateUrl: 'modules/mileages/views/view-mileage.client.view.html'
		}).
		state('editMileage', {
			url: '/mileages/:mileageId/edit',
			templateUrl: 'modules/mileages/views/edit-mileage.client.view.html'
		});
	}
]);