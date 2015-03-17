'use strict';

//Organisations service used to communicate Organisations REST endpoints
angular.module('organisations').factory('Organisations', ['$resource',
	function($resource) {
		return $resource('organisations/:organisationId', { organisationId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

//Organisations service used to communicate Organisations REST endpoints
angular.module('organisations').factory('OrganisationsUser', ['$resource',
    function($resource) {
        return $resource('organisations-user/:userId', { userId: '@user'
        });
    }
]);
angular.module('organisations').service('organisationService', ['$resource', 'Organisations', 'OrganisationsUser',
    function($resource, Organisations, OrganisationsUser) {
        this.findByUserId = function(userId) {
            return OrganisationsUser.get({
                userId: userId
            });
        }

    }
]);
