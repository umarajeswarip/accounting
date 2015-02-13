'use strict';

// Configuring the Articles module
angular.module('organisations').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('Organisation', 'Organisations', 'organisations', 'dropdown', '/organisations(/create)?');
		Menus.addSubMenuItem('Organisation', 'organisations', 'List Organisations', 'organisations');
		Menus.addSubMenuItem('Organisation', 'organisations', 'New Organisation', 'organisations/create');
	}
]);