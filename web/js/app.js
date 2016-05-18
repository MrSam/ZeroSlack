/*
 Copyright (C) 2016 - Sam Hermans

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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