'use strict';

// Invoices controller
angular.module('invoices').controller('InvoicesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Invoices', 'customerService', 'accountService',
    function($scope, $stateParams, $location, Authentication, Invoices, customerService, accountService) {
		$scope.authentication = Authentication;

		// Create new Invoice
		$scope.create = function() {
			// Create new Invoice object
			var invoice = new Invoices ($scope.invoiceElement);

			// Redirect after save
			invoice.$save(function(response) {
				$location.path('invoices/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Invoice
		$scope.remove = function(invoice) {
			if ( invoice ) { 
				invoice.$remove();

				for (var i in $scope.invoices) {
					if ($scope.invoices [i] === invoice) {
						$scope.invoices.splice(i, 1);
					}
				}
			} else {
				$scope.invoice.$remove(function() {
					$location.path('invoices');
				});
			}
		};

		// Update existing Invoice
		$scope.update = function() {
			var invoice = $scope.invoice;

			invoice.$update(function() {
				$location.path('invoices/' + invoice._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Invoices
		$scope.find = function() {
			$scope.invoices = Invoices.query();
		};

		// Find existing Invoice
		$scope.findOne = function() {
			$scope.invoice = Invoices.get({ 
				invoiceId: $stateParams.invoiceId
			});
		};

        $scope.initializeInvoiceUI = function() {
            $scope.selectedAccount = {};
            $scope.selectedCustomer = {};
            $scope.customers = customerService.find();
            $scope.accounts = accountService.find();
            $scope.invoiceElement = {};
            $scope.invoiceElement.total = 0;
            $scope.invoiceElement.invoiceDetails =[];
            $scope.currentInvoiceDetail = {};
        }

        $scope.addInvoice = function() {
            var invoiceDetail = {
                startDate: $scope.currentInvoiceDetail.startDate,
                endDate: $scope.currentInvoiceDetail.endDate,
                noOfDays: $scope.currentInvoiceDetail.noOfDays,
                rate: $scope.currentInvoiceDetail.rate,
                total: $scope.currentInvoiceDetail.noOfDays * $scope.currentInvoiceDetail.rate,
                customer: {
                    id: $scope.selectedCustomer._id,
                    name:$scope.selectedCustomer.name
                }
            }
            $scope.invoiceElement.account =$scope.selectedAccount._id;
            $scope.invoiceElement.total += invoiceDetail.total;
            $scope.invoiceElement.invoiceDetails.push(invoiceDetail
            );
            }
	    }
]);
