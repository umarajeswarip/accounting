'use strict';

angular.module('customers').controller('CustomersController', ['$scope', '$stateParams', '$location', 'Authentication', 'customerService',
	function($scope, $stateParams, $location, Authentication, customerService) {
        //, customerService) {
		$scope.authentication = Authentication;

		$scope.create = function() {
            customerService.create(this.name, this.address, function(response) {
                $location.path('customers/' + response._id);
            });
        }

		$scope.remove = function() {
            customerService.remove();
        }

        $scope.update = function() {
            customerService.update($scope.customer._id);
        }

		$scope.find = function() {
            $scope.customers = customerService.find();
        }

		$scope.findOne = function() {
            $scope.customer = customerService.findOne($stateParams.customerId);
        }
	}
]);
