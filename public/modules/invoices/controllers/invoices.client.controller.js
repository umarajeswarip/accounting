'use strict';

// Invoices controller
angular.module('invoices').controller('InvoicesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Invoices', 'customerService', 'accountService',
    'organisationService',
    function($scope, $stateParams, $location, Authentication, Invoices, customerService, accountService, organisationService) {
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

            var a = moment('2013-01-01');
            var b = moment('2013-06-01');
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

            for (var milageDate = milage.startDate; milageDate.isBefore(milage.endDate); milageDate.add(1, 'days')) {
                var dateToProcess = milageDate.clone();
                if (isWeekDay(dateToProcess) && !isBankHoliday(dateToProcess, bankHolildays.dates)) {
                    if ((( totalMilage < limit) && (totalMilage + milage.miles)> limit) || totalMilage > limit) {
                        rate = reducedRate;
                    }
                    milageEntry.push({date : dateToProcess, startPoint : milage.startPoint, endPoint : milage.endPoint, miles: milage.miles, cost: (rate * milage.miles)})
                    milageEntry.push({date : dateToProcess, startPoint : milage.endPoint, endPoint : milage.startPoint, miles: milage.miles, cost: (rate * milage.miles)})
                    totalMilage += (milage.miles * 2);
                }
            }
            console.log(milageEntry);
			$scope.invoices = Invoices.query();
		};

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
            $scope.invoiceElement.vat = 0;
            $scope.invoiceElement.otherExpenses = 0;
            $scope.invoiceElement.invoiceDetails =[];
            $scope.currentInvoiceDetail = {};
            $scope.organisation = organisationService.findByUserId($scope.authentication.user._id);
            console.log('organisation');
            console.log($scope.organisation);
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
            $scope.invoiceElement.organisation = $scope.organisation._id;
            $scope.invoiceElement.account =$scope.selectedAccount._id;
            $scope.invoiceElement.invoiceDetails.push(invoiceDetail);
            var total = 0;
            for (var index in $scope.invoiceElement.invoiceDetails) {
                var invoiceRow = $scope.invoiceElement.invoiceDetails[index];
                total += Number(invoiceRow.total);
            }
            total +=  Number($scope.invoiceElement.otherExpenses);
            var vat = (total * 0.2);
            total += vat;
            $scope.invoiceElement.vat = vat;
            $scope.invoiceElement.total = total;
            }

            $scope.generatePdf = function () {
                var invoiceDate = $.datepicker.formatDate("dd/mm/yy", new Date($scope.invoice.invoiceDate))

                var organisationDetails = [$scope.invoice.organisation.name + '\n', $scope.invoice.organisation.address.addressLine1 + '\n',
                    $scope.invoice.organisation.address.addressLine2 + '\n', $scope.invoice.organisation.address.city + '\n',
                    $scope.invoice.organisation.address.postCode + '\n'];

                var invoiceHeader = ['\n'+'\n'+'\nInvoiceDate: '+invoiceDate + '\n', 'InvoiceNumber: '+$scope.invoice.invoiceNumber+ '\n','Vat Number: '+$scope.invoice.organisation.vatNumber+ '\n',
                    'Company Number: ' +$scope.invoice.organisation.companyNumber+ '\n\n\n'];
                var invoiceTableHeader = ['Start Date', 'End Date', 'Client', 'No. of Days', 'Rate', 'Amount'];
                var invoiceTableContents =[];
                var invoiceTableRow = [];
                invoiceTableContents.push(invoiceTableHeader);
                for (var index in $scope.invoice.invoiceDetails) {
                    var invoiceRow = $scope.invoice.invoiceDetails[index];
                    var formattedStartDate = $.datepicker.formatDate("dd/mm/yy", new Date(invoiceRow.startDate));
                    var formattedEndDate = $.datepicker.formatDate("dd/mm/yy", new Date(invoiceRow.endDate));
                    invoiceTableRow.push(formattedStartDate, formattedEndDate, ''+invoiceRow.customer.name,
                    ''+invoiceRow.noOfDays,''+invoiceRow.rate, ''+invoiceRow.total);
                    invoiceTableContents.push(invoiceTableRow);
                }
                var invoiceTableFooter =[];
                var invoiceTableFooterRow1 =[];
                var invoiceTableFooterRow2 =[];
                invoiceTableFooterRow1.push('','','','', 'VAT',''+$scope.invoice.vat);
                invoiceTableFooterRow2.push('','','','','TOTAL',''+$scope.invoice.total);
                invoiceTableContents.push(invoiceTableFooterRow1);
                invoiceTableContents.push(invoiceTableFooterRow2);




                var docDefinition = { content: [{
                    text: organisationDetails,
                    style: 'header'
                },
                    {
                        text: invoiceHeader ,
                        style: 'body'
                    },
                    {
                        style: 'tableExample',
                        table: {
                            body: [
                                invoiceTableHeader, invoiceTableRow, invoiceTableFooterRow1, invoiceTableFooterRow2
                            ]
                        }
                    },
                    {
                        text: ['\n'+'\n'+'BankDetails:\nName: '+$scope.invoice.account.name + '\nA/C No: ', $scope.invoice.account.accountNumber+ '\nBranch: ',$scope.invoice.account.branch+ '\nSort Code:',
                            $scope.invoice.account.sortCode+ '\n'],
                        style: 'footer'
                    },

                ],
                    styles: {
                        header: {
                            fontSize: 18,
                            bold: false,
                            alignment: 'center'
                        },
                        body: {
                            fontSize: 18,
                            bold: false,
                            alignment: 'right'
                        },
                        footer: {
                            fontSize: 18,
                            bold: false,
                            alignment: 'left'
                        }
                    }
                };
                pdfMake.createPdf(docDefinition).open();
            }
	    }
]);
