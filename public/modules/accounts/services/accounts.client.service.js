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
        this.create = function() {
            // Create new Account object
            var account = new Accounts ({
                name: this.name,
                branch:this.branch,
                sortCode: this.sortCode,
                accountNumber:this.accountNumber
            });

            // Redirect after save
            account.$save(function(response) {
                $location.path('accounts/' + response._id);

                // Clear form fields
                //$scope.name = '';
            }, function(errorResponse) {
                //$scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Account
        this.remove = function(account) {
            if ( account ) {
                account.$remove();

                //for (var i in $scope.accounts) {
                //    if ($scope.accounts [i] === account) {
                //        $scope.accounts.splice(i, 1);
                //    }
                //}
            } else {
                //$scope.account.$remove(function() {
                //    $location.path('accounts');
                //});
            }
        };

        // Update existing Account
        this.update = function() {
            var account = $scope.account;

            account.$update(function() {
                //$location.path('accounts/' + account._id);
            }, function(errorResponse) {
                //$scope.error = errorResponse.data.message;
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
