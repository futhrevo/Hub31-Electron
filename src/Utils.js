module.exports.secondsToHms = function(d) {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor((d % 3600) / 60);
  var s = Math.floor((d % 3600) % 60);

  var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
  return hDisplay + mDisplay + sDisplay;
};

module.exports.replaceText = (selector, text) => {
  const element = document.getElementById(selector);
  if (element) element.innerText = text;
};

module.exports.getBasePath = function(source) {
  let basepath = source.split("/");
  if (basepath.length === 2) {
    return "/";
  }
  basepath.pop();
  return basepath.join("/");
};

/**
 * Parse progress line from ffmpeg stderr
 *
 * @param {String} line progress line
 * @return progress object
 * @private
 */
module.exports.parseProgressLine = function(line) {
  var progress = {};

  // Remove all spaces after = and trim
  line = line.replace(/=\s+/g, "=").trim();
  var progressParts = line.split("\n");

  // Split every progress part by "=" to get key and value
  for (var i = 0; i < progressParts.length; i++) {
    var progressSplit = progressParts[i].split("=", 2);
    var key = progressSplit[0];
    var value = progressSplit[1];

    // This is not a progress line
    if (typeof value === "undefined") return null;

    progress[key] = value;
  }

  return progress;
};

module.exports.setMaxProgress = function(node, val) {
  val = Number(val);
  node.max = val;
};

module.exports.setProgress = function(statusNode, progressNode, data) {
  const progress = exports.parseProgressLine(data);
  statusNode.innerText = progress.progress;
  // exports.replaceText(statusNode, progress.progress);
  progressNode.value = progress.out_time_us / 1000000;
};

module.exports.clearDirectory = function(directory) {
  const fs = require("fs");
  const path = require("path");
  if (fs.existsSync(directory)) {
    // check if file exists
    const files = fs.readdirSync(directory);
    if (files) {
      for (const file of files) {
        if ([".ts", ".m3u8"].indexOf(path.extname(file)) > -1) {
          fs.unlinkSync(path.join(directory, file));
        }
      }
    }
  }
};

module.exports.getFilesCount = function(directory) {
  const fs = require("fs");
  const path = require("path");
  let count = 0;
  if (fs.existsSync(directory)) {
    // check if file exists
    const files = fs.readdirSync(directory);

    if (files) {
      for (const file of files) {
        if ([".ts", ".m3u8"].indexOf(path.extname(file)) > -1) {
          count++;
        }
      }
    }
  }
  return count;
};
