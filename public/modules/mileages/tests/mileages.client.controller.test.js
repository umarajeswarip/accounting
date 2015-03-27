'use strict';

(function() {
	// Mileages Controller Spec
	describe('Mileages Controller Tests', function() {
		// Initialize global variables
		var MileagesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Mileages controller.
			MileagesController = $controller('MileagesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Mileage object fetched from XHR', inject(function(Mileages) {
			// Create sample Mileage using the Mileages service
			var sampleMileage = new Mileages({
				name: 'New Mileage'
			});

			// Create a sample Mileages array that includes the new Mileage
			var sampleMileages = [sampleMileage];

			// Set GET response
			$httpBackend.expectGET('mileages').respond(sampleMileages);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.mileages).toEqualData(sampleMileages);
		}));

		it('$scope.findOne() should create an array with one Mileage object fetched from XHR using a mileageId URL parameter', inject(function(Mileages) {
			// Define a sample Mileage object
			var sampleMileage = new Mileages({
				name: 'New Mileage'
			});

			// Set the URL parameter
			$stateParams.mileageId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/mileages\/([0-9a-fA-F]{24})$/).respond(sampleMileage);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.mileage).toEqualData(sampleMileage);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Mileages) {
			// Create a sample Mileage object
			var sampleMileagePostData = new Mileages({
				name: 'New Mileage'
			});

			// Create a sample Mileage response
			var sampleMileageResponse = new Mileages({
				_id: '525cf20451979dea2c000001',
				name: 'New Mileage'
			});

			// Fixture mock form input values
			scope.name = 'New Mileage';

			// Set POST response
			$httpBackend.expectPOST('mileages', sampleMileagePostData).respond(sampleMileageResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Mileage was created
			expect($location.path()).toBe('/mileages/' + sampleMileageResponse._id);
		}));

		it('$scope.update() should update a valid Mileage', inject(function(Mileages) {
			// Define a sample Mileage put data
			var sampleMileagePutData = new Mileages({
				_id: '525cf20451979dea2c000001',
				name: 'New Mileage'
			});

			// Mock Mileage in scope
			scope.mileage = sampleMileagePutData;

			// Set PUT response
			$httpBackend.expectPUT(/mileages\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/mileages/' + sampleMileagePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid mileageId and remove the Mileage from the scope', inject(function(Mileages) {
			// Create new Mileage object
			var sampleMileage = new Mileages({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Mileages array and include the Mileage
			scope.mileages = [sampleMileage];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/mileages\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleMileage);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.mileages.length).toBe(0);
		}));
	});
}());