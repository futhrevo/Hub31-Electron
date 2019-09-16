// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const Utils = require("./src/Utils");
window.addEventListener("DOMContentLoaded", () => {
  for (const type of ["chrome", "node", "electron"]) {
    Utils.replaceText(`${type}-version`, process.versions[type]);
  }
});
