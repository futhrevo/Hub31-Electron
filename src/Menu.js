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
              height: 400,
              resizable: true,
              webPreferences: {
                nodeIntegration: true
              }
            });
            prefWindow.loadFile("static/preferences.html");
            // Open the DevTools.
            // prefWindow.webContents.openDevTools();
            prefWindow.show();
          }
        }
      ]
    },
    {
      label: "Edit",
      submenu: [
        { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
        { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
        { type: "separator" },
        { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
        { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
        { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
        {
          label: "Select All",
          accelerator: "CmdOrCtrl+A",
          selector: "selectAll:"
        }
      ]
    }
  ]);
};
