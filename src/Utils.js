const secondsToHms = function(d) {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor((d % 3600) / 60);
  var s = Math.floor((d % 3600) % 60);

  var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
  return hDisplay + mDisplay + sDisplay;
};

const replaceText = (selector, text) => {
  const element = document.getElementById(selector);
  if (element) element.innerText = text;
};

const getBasePath = function(source) {
  const path = require("path");
  return path.dirname(source);
};

const getTargetPath = function(source, video) {
  const path = require("path");
  return path.join(getBasePath(source), videoid);
};

const getTargetPng = function(source, video) {
  const path = require("path");
  return path.join(getTargetPath(source, video), `${video}.png`);
};
/**
 * Parse progress line from ffmpeg stderr
 *
 * @param {String} line progress line
 * @return progress object
 * @private
 */
const parseProgressLine = function(line) {
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

const setMaxProgress = function(node, val) {
  val = Number(val);
  node.max = val;
};

const setProgress = function(statusNode, progressNode, data) {
  const progress = parseProgressLine(data);
  statusNode.innerText = progress.progress;
  // exports.replaceText(statusNode, progress.progress);
  progressNode.value = progress.out_time_us / 1000000;
};

const clearDirectory = function(directory) {
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

const getFilesCount = function(directory) {
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

const writePlaylist = function(filepath, playlist) {
  const fs = require("fs");
  const path = require("path");
  if (!fs.existsSync(filepath)) {
    fs.mkdirSync(filepath);
  }
  let targetfile = path.join(filepath, "playlist.m3u8");
  console.log(targetfile);

  fs.writeFile(targetfile, playlist, err => {
    // In case of a error throw err.
    if (err) throw err;
  });
};

const getKeyUrl = function(video) {
  const { rooturl } = require("./Constants");
  return `${rooturl}/?video=${video}`;
};
module.exports = {
  secondsToHms,
  replaceText,
  getBasePath,
  getTargetPath,
  getTargetPng,
  parseProgressLine,
  setProgress,
  setMaxProgress,
  clearDirectory,
  getFilesCount,
  writePlaylist,
  getKeyUrl
};
