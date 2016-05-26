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

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let authWin;
const {BrowserWindow} = require('electron').remote;
const ipc = require('electron').ipcRenderer;

var ZeroSlack = angular.module('ZeroSlack',[]);

ZeroSlack.controller('AuthController', ['$scope','$http', function($scope, $http) {

    $scope.accounts = Lockr.getAll();
    $scope.isDisabled = false;

    $scope.delete = function(account) {
        Lockr.rm(account.name);
        $scope.accounts = Lockr.getAll();
    };

    $scope.connect = function() {
        ipc.send('open_nicklist');
    };

    $scope.submit = function() {

        $scope.isDisabled = true;

        var auth_uri = "https://slack.com/oauth/authorize?" +
            $.param({
                client_id: slack_client_id,
                scope: "client"
            });

        authWin = new BrowserWindow({width: 600, height: 750, title: "Authenticate"});
        authWin.loadURL("");
        authWin.show();

        // catch redirections in the OAuth flow and stop em before they happen.
        function handleCallback(url) {
            var raw_code = /code=([^&]*)/.exec(url) || null;
            var code = (raw_code && raw_code.length > 1) ? raw_code[1] : null;
            var error = /\?error=(.+)$/.exec(url);

            if (code) {
                var oauth_uri = "https://slack.com/api/oauth.access?" +
                    $.param({
                        client_id: slack_client_id,
                        client_secret: slack_secret,
                        code: code
                    });

                $http({
                    method: 'GET',
                    url: oauth_uri
                }).then(function successCallback(res) {
                    Lockr.set(res.data.team_name, {token:res.data.access_token, name:res.data.team_name});
                    $scope.accounts = Lockr.getAll();
                });

                // go to next step!
            } else if (error) {
                alert('Oops! Something went wrong and we couldn\'t' +
                    'log you in using Slack. Please try again.');
            }

            // we did what we had to do, now close it
            if (code || error) {
                authWin.destroy();
            }
        }

        // TODO: What if user clicks cancel ?

        // Emitted when the window is closed.
        authWin.on('closed', () => authWin = null);

        // detect redirections and handle them
        authWin.webContents.on('will-navigate', function (event, url) {
            handleCallback(url);
        });
    }
}]);