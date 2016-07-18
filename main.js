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

const electron = require('electron');
// Module to control application life.
const {app} = electron;
// Module to create native browser window.
const {BrowserWindow} = electron;

var ipc_main = require('electron').ipcMain;

let win;
let nickWin;

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({width: 500, height: 400, title: "ZeroSlack"});

    // and load the index.html of the app.
    win.loadURL('file://' + __dirname + '/welcome.html');

    // Open the DevTools.
    //win.webContents.openDevTools();

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object
        win = null;
});
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => app.quit());

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
    createWindow();
}
});

ipc_main.on('open_nicklist', function(event) {
    if (nickWin != null) {
        console.log("We had an open nicklist");
        nickWin.show();
    } else {
        console.log("Opening new nicklist");
        // only do this if there is no window yet
        nickWin = new BrowserWindow({width: 240, height: 500, x:80,y:80});
        nickWin.loadURL('file://' + __dirname + '/nicklist.html');
        nickWin.show();
        //nickWin.webContents.openDevTools();

        //nickWin.on('focus', function () {
        //    nickWin.webContents.send('_message', 'sammeke');
        //});

        nickWin.on('closed', () => {
            nickWin = null;
        });

        console.log("Closing index window");
        win.close();
    }
});

ipc_main.on('nicklist_init', function(event) {
    event.sender.send("init");
});