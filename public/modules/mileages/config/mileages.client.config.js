'use strict';

// Configuring the Articles module
angular.module('mileages').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Mileages', 'mileages', 'dropdown', '/mileages(/create)?');
		Menus.addSubMenuItem('topbar', 'mileages', 'List Mileages', 'mileages');
		Menus.addSubMenuItem('topbar', 'mileages', 'New Mileage', 'mileages/create');
	}
]);