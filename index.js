(function (angular) {
    angular.module('app', []).
    controller('indexCtrl', function ($scope) {
        $scope.add = function (a, b) {
            if(a&&b)
            return Number(a) + Number(b)
            return 0;
        }
    });
})(window.angular);