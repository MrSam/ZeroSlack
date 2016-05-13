var ZeroSlack = angular.module('ZeroSlack',[]);

ZeroSlack.controller('LoginController', ['$scope', function($scope) {

    $scope.submit = function() {
        window.location.href = "https://slack.com/oauth/authorize?" +
            $.param({
                client_id: "35817589173.42673138644",
                scope: "client"
            });
    }
}]);