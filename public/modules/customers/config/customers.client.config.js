'use strict';

// Configuring the Articles module
angular.module('articles').run(['Menus',
	function(Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Customer', 'customers', 'dropdown', '/customers(/create)?');
        Menus.addSubMenuItem('topbar', 'customers', 'List Customer', 'customers');
        Menus.addSubMenuItem('topbar', 'customers', 'New Customer', 'customers/create');
	}
]);
