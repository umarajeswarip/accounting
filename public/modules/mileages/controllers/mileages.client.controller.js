'use strict';

// Mileages controller
angular.module('mileages').controller('MileagesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Mileages',
	function($scope, $stateParams, $location, Authentication, Mileages) {
		$scope.authentication = Authentication;
        $scope.mileagesInMem = [];
        $scope.mileageQuery = {};

        function isBankHoliday(m, dates) {
            for (var i =0; i < dates.length; i++) {
                if (m.isSame(dates[i])) {
                    return true;
                }
            }
            return false;
        }
        function isWeekDay(m) {
            var dayOfWeek = m.isoWeekday();
            if (dayOfWeek == 6 || dayOfWeek == 7) {
                return false;
            }
            return true;
        }

        $scope.addMileage = function() {
            var rate = 0.45;
            var startDate = moment($scope.addMileageQuery.date).startOf('month');
            $scope.mileagesInMem.push({date : startDate.toDate(), startPoint : $scope.addMileageQuery.startPoint, endPoint : $scope.addMileageQuery.endPoint, miles: $scope.addMileageQuery.miles, cost: (rate * $scope.addMileageQuery.miles)})
            $scope.addMileageQuery = {};
        }
        $scope.generateMileage = function() {
            $scope.mileagesInMem = {};
            var milage = {
                startDate: moment('2015-04-01'),
                endDate: moment('2015-04-30'),
                startPoint: 'Bexley',
                endPoint: 'Faversham',
                miles: 43
            }

            var milageEntry = [];
            var yearlyMilage = {
                year : 2015,
                total: 9700
            }

            var bankHolildays = {
                year : 2015,
                dates : [moment('2015-01-01'), moment('2015-04-03'), moment('2015-04-06'), moment('2015-05-04'),
                    moment('2015-05-25'),moment('2015-07-31'),moment('2015-12-25'),moment('2015-12-28')]
            }

            var totalMilage = yearlyMilage.total;
            var fullRate = 0.45;
            var reducedRate = 0.20;
            var limit = 10000;
            var rate = fullRate;

            var startDate = moment($scope.mileageQuery.date).startOf('month');
            var endDate = moment($scope.mileageQuery.date).endOf('month');
            for (var milageDate = startDate; milageDate.isBefore(endDate); milageDate.add(1, 'days')) {
                var dateToProcess = milageDate.clone();
                if (isWeekDay(dateToProcess) && !isBankHoliday(dateToProcess, bankHolildays.dates)) {
                    if ((( totalMilage < limit) && (totalMilage + milage.miles)> limit) || totalMilage > limit) {
                        rate = reducedRate;
                    }
                    milageEntry.push({date : dateToProcess.toDate(), startPoint : $scope.mileageQuery.startPoint, endPoint : $scope.mileageQuery.endPoint, miles: $scope.mileageQuery.miles, cost: (rate * milage.miles)})
                    milageEntry.push({date : dateToProcess.toDate(), startPoint : $scope.mileageQuery.endPoint, endPoint : $scope.mileageQuery.startPoint, miles: $scope.mileageQuery.miles, cost: (rate * milage.miles)})
                    totalMilage += (milage.miles * 2);
                }
            }
            console.log(milageEntry);
            $scope.mileagesInMem = milageEntry;
        }

        $scope.removeMileage = function(index) {
            if (index == -1) {
                return;
            }
            $scope.mileagesInMem.splice(index,1);
        }
		// Create new Mileage
		$scope.create = function() {
			// Create new Mileage object
			var mileage = new Mileages ({
				name: this.name
			});

			// Redirect after save
			mileage.$save(function(response) {
				$location.path('mileages/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Mileage
		$scope.remove = function(mileage) {
			if ( mileage ) { 
				mileage.$remove();

				for (var i in $scope.mileages) {
					if ($scope.mileages [i] === mileage) {
						$scope.mileages.splice(i, 1);
					}
				}
			} else {
				$scope.mileage.$remove(function() {
					$location.path('mileages');
				});
			}
		};

		// Update existing Mileage
		$scope.update = function() {
			var mileage = $scope.mileage;

			mileage.$update(function() {
				$location.path('mileages/' + mileage._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Mileages
		$scope.find = function() {
			$scope.mileages = Mileages.query();
		};

		// Find existing Mileage
		$scope.findOne = function() {
			$scope.mileage = Mileages.get({ 
				mileageId: $stateParams.mileageId
			});
		};
	}
]);
