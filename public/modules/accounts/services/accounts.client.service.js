'use strict';

//Accounts service used to communicate Accounts REST endpoints
angular.module('accounts').factory('Accounts', ['$resource',
	function($resource) {
		return $resource('accounts/:accountId', { accountId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

//Articles service used for communicating with the articles REST endpoints
angular.module('accounts').service('accountService', ['$resource', 'Accounts',
    function($resource, Accounts) {
        // Create new Account
        this.create = function(name, branch, sortCode, accountNumber, responseHandler) {
            // Create new Account object
            var account = new Accounts ({
                name: name,
                branch:branch,
                sortCode: sortCode,
                accountNumber:accountNumber
            });
            // Redirect after save
            account.$save(function(response) {
                responseHandler(response);
            }, function(errorResponse) {
                console.log(errorResponse);
            });
        };

        // Remove existing Account
        this.remove = function(account, responseHandler) {
            if ( account ) {
                account.$remove( function(response) {
                    responseHandler(response);
                });
            } else {
            }
        };

        // Update existing Account
        this.update = function(account, responseHandler) {

            account.$update(function(response) {
                responseHandler(response);
            }, function(errorResponse) {
                responseHandler(errorResponse);
            });
        };

        // Find a list of Accounts
        this.find = function() {
            return Accounts.query();
        };

        // Find existing Account
        this.findOne = function(customerId) {
            return Accounts.get({
                accountId: customerId
            });
        };
    }
]);
