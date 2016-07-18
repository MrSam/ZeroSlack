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

// IPC
const ipc = require('electron').ipcRenderer;
ipc.send('nicklist_init');

ipc.on('init', function(event, data) {
    var slack_accounts = Lockr.getAll();
    angular.forEach(slack_accounts, function(account) {
        connectToSlack(account.name, account.token);
    });

});

// EVENTS
var events = require('events');
var eventEmitter = new events.EventEmitter();

// Angular
var ZeroSlack = angular.module('ZeroSlack',[]);
ZeroSlack.controller('NickListController', ['$scope','$http', function($scope, $http) {

    $scope.rawmessages = [];

    // EVENTS
    eventEmitter.on("rawmessage", function(data)
    {
        //console.log(data);
        $scope.rawmessages.push(JSON.stringify(data.message));
        $scope.$apply();
    });

}]);

let open_connections = [];

// create the SlackConnection class
function SlackConnection(ws, channels, ims, team) {
    this.ws = ws; // the socket to use when replying
    this.channels = channels; // slack channels
    this.ims = ims; // open im's
    this.team = team; // team information (like name etc)
}

// NODE.JS
function connectToSlack(account_name, account_token) {
    var http = require('https');

    var options = {
        host: 'slack.com',
        port: 443,
        path: '/api/rtm.start?token=' + account_token,
        method: 'GET'
    };

    var req = http.get(options, function (res) {
        res.setEncoding('utf8');
        var body = '';

        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function () {
            var slackResponse = JSON.parse(body);

            var WebSocket = require('ws'); // new websocket for this connection
            var ws = new WebSocket(slackResponse.url); // Use the path we got back from the GET request

            // Store this conenction using account_name as key
            open_connections[account_name] = new SlackConnection(ws, slackResponse.channels, slackResponse.ims, slackResponse.team);

            console.log(open_connections);

            ws.on('message', function (data, flags) {
                //console.log("<<", account_name, data);

                var messageData = JSON.parse(data);
                eventEmitter.emit("rawmessage", {"account_name": account_name, "message": messageData});
            });

            ws.on('close', function close() {
                console.log("<<", account_name, 'disconnected');
            });
        });
    });
}

