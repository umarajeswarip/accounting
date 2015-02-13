'use strict';

var app = angular.module('demo', ['ngSanitize', 'ui.date', 'ui.layout']);

app.directive('onlyDigits', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, element, attr, ctrl) {
            function inputValue(val) {
                if (val) {
                    var digits = val.replace(/[^0-9.]/g, '');

                    if (digits !== val) {
                        ctrl.$setViewValue(digits);
                        ctrl.$render();
                    }
                    return parseFloat(digits);
                }
                return undefined;
            }

            ctrl.$parsers.push(inputValue);
        }
    };
});

/**
 * AngularJS default filter with the following expression:
 * "person in people | filter: {name: $select.search, age: $select.search}"
 * performs a AND between 'name: $select.search' and 'age: $select.search'.
 * We want to perform a OR.
 */
app.filter('propsFilter', function() {
  return function(items, props) {
    var out = [];

    if (angular.isArray(items)) {
      items.forEach(function(item) {
        var itemMatches = false;

        var keys = Object.keys(props);
        for (var i = 0; i < keys.length; i++) {
          var prop = keys[i];
          var text = props[prop].toLowerCase();
          if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
            itemMatches = true;
            break;
          }
        }

        if (itemMatches) {
          out.push(item);
        }
      });
    } else {
      // Let the output be the input untouched
      out = items;
    }

    return out;
  };
});

app.controller('DemoCtrl', function($scope, $http, $timeout) {
    $scope.disabled = undefined;
    $scope.searchEnabled = undefined;

    $scope.enable = function () {
        $scope.disabled = false;
    };

    $scope.disable = function () {
        $scope.disabled = true;
    };

    $scope.enableSearch = function () {
        $scope.searchEnabled = true;
    }

    $scope.disableSearch = function () {
        $scope.searchEnabled = false;
    }

    $scope.clear = function () {
        $scope.customers.selected = undefined;
        $scope.accounts.selected = undefined;
    };
    $scope.customers = [{
        id: 1,
        name: "CPS"
    }, {
        id: 2,
        name: "DNV-GL"
    }, {
        id: 3,
        name: "AIMIA"
    }, {
        id: 4,
        name: "GIST"
    }];
    $scope.selected_status = 3;
    $scope.accounts = [{
        id: 1,
        name: "HSBC",
        sortcode: "10-10-10",
        branch: "southwark"
    },
        {
            id: 2,
            name: "Barclays",
            sortcode: "11-10-10",
            branch: "southwark"
        },
        {
            id: 3,
            name: "Lloyds",
            sortcode: "12-10-10",
            branch: "southwark"
        }];

    $scope.company = {
        id: 1,
        name: "Meena Soft Ltd",
        address: {addressLine1: "Line1", addressLine2: "Town", city: "City", postCode: "Pc1"},
        companyNumber: "15",
        vat: {
            id: 1,
            vatno: "SJ1234",
            vatName: "valli"
        }
    };

    $scope.invoiceDetails = {
        date: "20th October 2014",
        invoiceNumber: "15"
    };

    $scope.account = {
        id: 1,
        number: "12345",
        name: "HSBC",
        sortcode: "10-10-10",
        branch: "southwark"
    };


    $scope.generatePdf = function () {
        var doc = new PDFDocument();
        var stream = doc.pipe(blobStream());

// draw some text
        doc.fontSize(25)
            .text('Here is some vector graphics...', 100, 80);

        doc.text($scope.company.name, {
            align: 'center'
        }).font('Times-Roman', 13)
            .moveDown()
            .text("address1");

// end and display the document in the iframe to the right
        doc.end();
        stream.on('finish', function() {
            var url = stream.toBlobURL('application/pdf')
            window.open(url);
        });
    }
});


