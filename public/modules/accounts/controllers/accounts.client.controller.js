'use strict';

// Accounts controller
angular.module('accounts').controller('AccountsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Accounts',
	function($scope, $stateParams, $location, Authentication, accountService) {
		$scope.authentication = Authentication;

        $scope.authentication = Authentication;

        $scope.create = function() {
            accountService.create(this.name, this.address, function(response) {
                $location.path('accounts/' + response._id);
            });
        }

        $scope.remove = function() {
            accountService.remove();
        }

        $scope.update = function() {
            accountService.update($scope.account._id);
        }

        $scope.find = function() {
            $scope.accounts = accountService.find();
        }

        $scope.findOne = function() {
            $scope.account = accountService.findOne($stateParams.accountId);
        }
	}
]);
