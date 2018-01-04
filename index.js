(function (angular) {
    angular.module('app', []).
    controller('indexCtrl', function ($scope,$http) {
        $scope.name = 'karma';
        $scope.user = '';
        $scope.add = function (a, b) {
            if(a&&b)
            return Number(a) + Number(b)
            return 0;
        }
        $scope.getUser = function() {
            $http.get('/auth.py').then(function(response) {
                $scope.user = response.data;
            })
        }
    });
})(window.angular);