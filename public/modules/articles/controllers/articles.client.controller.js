'use strict';

angular.module('articles').service('ArticlesService', ['Articles', function(Articles) {
    this.getData = function (Articles) {
        return "Hello World";
    };
}]);

angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles', 'ArticlesService',
	function($scope, $stateParams, $location, Authentication, Articles, ArticlesService) {
		$scope.authentication = Authentication;
        $scope.doc = new jsPDF();
        $scope.helloData = "";

		$scope.create = function() {
			var article = new Articles({
				title: this.title,
				content: this.content
			});
			article.$save(function(response) {
                //$scope.doc.text(20, 20, 'Hello world!');
                //$scope.doc.text(20, 30, 'This is client-side Javascript, pumping out a PDF.');
                //$scope.doc.addPage();
                //$scope.doc.text(20, 20, 'Do you like that?');
                //$scope.doc.save('sample-file4.pdf');

                $location.path('articles/' + response._id);

				//$scope.title = '';
				//$scope.content = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(article) {
			if (article) {
				article.$remove();

				for (var i in $scope.articles) {
					if ($scope.articles[i] === article) {
						$scope.articles.splice(i, 1);
					}
				}
			} else {
				$scope.article.$remove(function() {
					$location.path('articles');
				});
			}
		};

		$scope.update = function() {
			var article = $scope.article;

			article.$update(function() {
				$location.path('articles/' + article._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
            $scope.helloData = ArticlesService.getData()
			$scope.articles = Articles.query();
		};

		$scope.findOne = function() {
			$scope.article = Articles.get({
				articleId: $stateParams.articleId
			});
		};
	}
]);
