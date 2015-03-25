'use strict';

// Employees controller
angular.module('employees').controller('EmployeesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Employees',
	function($scope, $stateParams, $location, Authentication, Employees) {
		$scope.authentication = Authentication;

		// Create new Employee
		$scope.create = function() {
			// Create new Employee object
			var employee = new Employees ({
				name: this.name,
                position: this.position,
                salary: this.salary
			});

			// Redirect after save
			employee.$save(function(response) {
				$location.path('employees/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Employee
		$scope.remove = function(employee) {
			if ( employee ) { 
				employee.$remove();

				for (var i in $scope.employees) {
					if ($scope.employees [i] === employee) {
						$scope.employees.splice(i, 1);
					}
				}
			} else {
				$scope.employee.$remove(function() {
					$location.path('employees');
				});
			}
		};

		// Update existing Employee
		$scope.update = function() {
			var employee = $scope.employee;

			employee.$update(function() {
				$location.path('employees/' + employee._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Employees
		$scope.find = function() {
			$scope.employees = Employees.query();
		};

		// Find existing Employee
		$scope.findOne = function() {
			$scope.employee = Employees.get({ 
				employeeId: $stateParams.employeeId
			});
		};
	}
]);
