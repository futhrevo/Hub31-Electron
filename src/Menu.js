const { app, Menu, BrowserWindow } = require("electron");

module.exports = function(win) {
  return Menu.buildFromTemplate([
    {
      label: app.getName(),
      submenu: [
        {
          label: "Reload",
          accelerator: "CmdOrCtrl+R", // shortcut
          click: (item, focusedWindow) => {
            if (focusedWindow) {
              // on reload, start fresh and close any old open secoindary windows
              if (focusedWindow.id === 1) {
                BrowserWindow.getAllWindows().forEach(win => {
                  if (win.id > 1) win.close();
                });
              }
              focusedWindow.reload();
            }
          }
        },
        {
          label: `Preferences`,
          accelerator: "CmdOrCtrl+,", // shortcut
          click: _ => {
            let prefWindow = new BrowserWindow({
              width: 500,
              height: 300,
              resizable: false
            });
            prefWindow.loadFile("static/preferences.html");
            prefWindow.show();
          }
        }
      ]
    }
  ]);
};
