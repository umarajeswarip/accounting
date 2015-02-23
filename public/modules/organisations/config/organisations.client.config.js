'use strict';

// Configuring the Articles module
angular.module('organisations').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Organisations', 'organisations', 'dropdown', '/organisations(/create)?');
		Menus.addSubMenuItem('topbar', 'organisations', 'List Organisations', 'organisations');
		Menus.addSubMenuItem('topbar', 'organisations', 'New Organisation', 'organisations/create');
	}
]);
