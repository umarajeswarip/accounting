'use strict';

// Incomes controller
angular.module('incomes').controller('IncomesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Incomes',
	function($scope, $stateParams, $location, Authentication, Incomes) {
		$scope.authentication = Authentication;
        $scope.incomeMems = [];
        $scope.incomeMem = {};
        $scope.updateIndex = -1;
        $scope.saveLabel = 'Add Income';

        $scope.updateIncome = function() {
            $scope.saveLabel = 'Add Income';
            if ($scope.updateIndex == -1) {
                $scope.incomeMems.push($scope.incomeMem);
                $scope.incomeMem = {}
            } else {
                angular.copy($scope.incomeMem, $scope.incomeMems[$scope.updateIndex]);
                $scope.incomeMem = {}
                $scope.updateIndex = -1;
            }
        }

        $scope.editIncome = function(index) {
            if (index == -1) {
                return;
            }
            $scope.incomeMem = {};
            angular.copy($scope.incomeMems[index], $scope.incomeMem);
            $scope.updateIndex = index;
            $scope.saveLabel = 'Update Income';
        }
        $scope.removeIncome = function(index) {
            if (index == -1) {
                return;
            }
            $scope.incomeMems.splice(index, 1);
        }

		// Create new Income
		$scope.create = function() {
			// Create new Income object
			var income = new Incomes ({
				name: this.name
			});

			// Redirect after save
			income.$save(function(response) {
				$location.path('incomes/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Income
		$scope.remove = function(income) {
			if ( income ) { 
				income.$remove();

				for (var i in $scope.incomes) {
					if ($scope.incomes [i] === income) {
						$scope.incomes.splice(i, 1);
					}
				}
			} else {
				$scope.income.$remove(function() {
					$location.path('incomes');
				});
			}
		};

		// Update existing Income
		$scope.update = function() {
			var income = $scope.income;

			income.$update(function() {
				$location.path('incomes/' + income._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Incomes
		$scope.find = function() {
			$scope.incomes = Incomes.query();
		};

		// Find existing Income
		$scope.findOne = function() {
			$scope.income = Incomes.get({ 
				incomeId: $stateParams.incomeId
			});
		};
	}
]);
