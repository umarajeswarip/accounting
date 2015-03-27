'use strict';



// Expenses controller
angular.module('expenses').controller('ExpensesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Expenses',
	function($scope, $stateParams, $location, Authentication, Expenses) {
		$scope.authentication = Authentication;
        $scope.expenses1 = [];
        $scope.expense1 = {};
        $scope.updateIndex = -1;
        $scope.saveLabel = 'Add Expense';

        $scope.dateOptions = {
            dateFormat: "MM-yy",
            changeYear: true,
            changeMonth: true,
            viewMode: "years",
            minViewMode: "months"
        };

        $scope.updateExpense = function() {
            $scope.saveLabel = 'Add Expense';
            if ($scope.updateIndex == -1) {
                $scope.expenses1.push($scope.expense1);
                $scope.expense1 = {}
            } else {
                angular.copy($scope.expense1, $scope.expenses1[$scope.updateIndex]);
                $scope.expense1 = {}
                $scope.updateIndex = -1;
            }
        }

        $scope.editExpense = function(index) {
            if (index == -1) {
                return;
            }
            $scope.expense1 = {};
            angular.copy($scope.expenses1[index], $scope.expense1);
            $scope.updateIndex = index;
            $scope.saveLabel = 'Update Expense';
        }
        $scope.removeExpense = function(index) {
            if (index == -1) {
                return;
            }
            $scope.expenses1.splice(index, 1);
        }
		// Create new Expense
		$scope.create = function() {
			// Create new Expense object
			var expense = new Expenses ({
				name: this.name
			});

			// Redirect after save
			expense.$save(function(response) {
				$location.path('expenses/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Expense
		$scope.remove = function(expense) {
			if ( expense ) { 
				expense.$remove();

				for (var i in $scope.expenses) {
					if ($scope.expenses [i] === expense) {
						$scope.expenses.splice(i, 1);
					}
				}
			} else {
				$scope.expense.$remove(function() {
					$location.path('expenses');
				});
			}
		};

		// Update existing Expense
		$scope.update = function() {
			var expense = $scope.expense;

			expense.$update(function() {
				$location.path('expenses/' + expense._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Expenses
		$scope.find = function() {
			$scope.expenses = Expenses.query();
		};

		// Find existing Expense
		$scope.findOne = function() {
			$scope.expense = Expenses.get({ 
				expenseId: $stateParams.expenseId
			});
		};
	}
]);
