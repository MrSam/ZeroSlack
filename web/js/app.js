var ZeroSlack = angular.module('ZeroSlack',[]);

ZeroSlack.controller('LoginController', ['$scope', function($scope) {

    $scope.submit = function() {

        var auth_uri = "https://slack.com/oauth/authorize?" +
            $.param({
                client_id: "35817589173.42673138644",
                scope: "client"
            });

        var chrome_app_id = chrome.runtime.id;
        console.log(chrome_app_id);

        // Create a new window and get it
        nw.Window.open(auth_uri, {resizable: false, id:"Auth_Window", title:"Slack Auth"}, function(new_win) {
            // And listen to new window's focus event
            new_win.on('focus', function () {
                console.log('New window is focused');
            });
        });
    }
}]);