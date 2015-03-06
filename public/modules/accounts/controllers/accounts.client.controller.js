'use strict';

// Accounts controller
angular.module('accounts').controller('AccountsController', ['$scope', '$stateParams', '$location', 'Authentication', 'accountService',
	function($scope, $stateParams, $location, Authentication, accountService) {
		$scope.authentication = Authentication;

        $scope.authentication = Authentication;

        $scope.create = function() {
            accountService.create(this.name, this.branch, this.sortCode, this.accountNumber, function(response) {
                $location.path('accounts/' + response._id);
            });
        }

        $scope.remove = function() {
            accountService.remove($scope.account, function(response) {
                $location.path('accounts');
            });
        }

        $scope.update = function() {
            accountService.update($scope.account, function(response) {
                $location.path('accounts/' + response._id);
            });
        }

        $scope.find = function() {
            $scope.accounts = accountService.find();
        }

        $scope.findOne = function() {
            $scope.account = accountService.findOne($stateParams.accountId);
        }
	}
]);
