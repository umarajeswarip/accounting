'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('customers').factory('Customers', ['$resource',
    function($resource) {
        return $resource('customers/:customerId', {
            customerId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);

//Articles service used for communicating with the articles REST endpoints
angular.module('customers').service('customerService', ['$resource', 'Customers',
	function($resource, Customers) {
            this.create = function (name, address, responseHandler) {
                var customer = new Customers({
                    name: name,
                    address: address
                });
                customer.$save(function (response) {
                    responseHandler(response);
                }, function (errorResponse) {
                    //$scope.error = errorResponse.data.message;
                });
            };

            this.remove = function (customer) {
                if (customer) {
                    customer.$remove();

                } else {
                    //$scope.customer.$remove(function () {
                    //    $location.path('customers');
                    //});
                }
            };

            this.update = function (customerId) {
                customer.$update(function () {
                    //$location.path('customers/' + customerId);
                }, function (errorResponse) {
                    //$scope.error = errorResponse.data.message;
                });
            };

            this.find = function () {
                return Customers.query();
            };

            this.findOne = function (customerId) {
                return Customers.get({
                    customerId: customerId
                });
            }
    }
]);
