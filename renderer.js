// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const { ipcRenderer, shell } = require("electron");
var cmd = require("node-cmd");
var FFProbe = require("./src/ProbeVideo");
const Utils = require("./src/Utils");

let filepath = "";
let keyFrameInterval = -1;
let user = "";
let videoid = "";
let processRef;
let totalduration = 0;

const selectVideoBtn = document.getElementById("select-video-file");
const pasteConfigBtn = document.getElementById("paste-config-btn");
const startButton = document.getElementById("start-ffmpeg-button");
const stopButton = document.getElementById("stop-ffmpeg-button");
const statusMsg = document.getElementById("progress-status");
const progressbar = document.getElementById("ffmpeg-progress");
const resetButton = document.getElementById("reset-button");
const uploadButton = document.getElementById("upload-video-button");
const previewButton = document.getElementById("poster-preview");

ipcRenderer.on("selected-video-file", (event, path) => {
  if (path.length > 0) {
    filepath = path[0];
    cmd.get(FFProbe.getFFprobeCmd(filepath), function(err, data, stderr) {
      const probedData = FFProbe.parseProbe(data);
      totalduration = probedData.duration;
      Utils.setMaxProgress(progressbar, totalduration);
      probedData.duration = Utils.secondsToHms(probedData.duration);
      keyFrameInterval = FFProbe.getKeyFrameInterval(probedData.fps);
      for (let prop in probedData) {
        if (Object.prototype.hasOwnProperty.call(probedData, prop)) {
          Utils.replaceText(`video-${prop}`, probedData[prop]);
        }
      }
    });
  }
  document.getElementById("selected-file").innerHTML = filepath;
});

selectVideoBtn.addEventListener("click", event => {
  ipcRenderer.send("open-file-dialog");
});

pasteConfigBtn.addEventListener("click", event => {
  const { clipboard } = require("electron");
  try {
    const payload = JSON.parse(clipboard.readText());
    if (
      Object.prototype.hasOwnProperty.call(payload, "user") &&
      Object.prototype.hasOwnProperty.call(payload, "video")
    ) {
      user = payload.user;
      videoid = payload.video;
      ["user", "video"].forEach(prop => {
        Utils.replaceText(`config-${prop}`, payload[prop]);
      });
    }
  } catch (e) {}
});

startButton.addEventListener("click", event => {
  if (keyFrameInterval < 0) {
    return alert("Video not found");
  }
  console.log(keyFrameInterval);
  const FFMpeg = require("./src/FFMpeg");
  if (videoid.length < 5 || user.length < 5) {
    return alert("Invalid video configuration");
  }
  const targetPath = `${Utils.getBasePath(filepath)}/${videoid}`;
  Utils.clearDirectory(targetPath);
  const { command, master_playlist } = FFMpeg.getRenditionCmd(
    keyFrameInterval,
    targetPath
  );
  const { misc_params } = require("./src/Constants");
  cmd.run(
    `mkdir -p ${targetPath}
    echo "${master_playlist}" | tee ${targetPath}/playlist.m3u8`
  );
  console.log(
    `Executing command:\nffmpeg ${misc_params} -i ${filepath} ${command}`
  );
  getPoster(poster => {
    processRef = cmd.get(`ffmpeg ${misc_params} -i ${filepath} ${command}`);
    //listen to the python terminal output
    processRef.stdout.on("data", function(data) {
      Utils.setProgress(statusMsg, progressbar, data);
    });

    processRef.stderr.on("data", function(data) {
      console.log(data);
    });
  });
});

stopButton.addEventListener("click", event => {
  console.log(processRef.pid);
  process.kill(processRef.pid, "SIGINT");
});

resetButton.addEventListener("click", event => {
  // reset variables to initial values
  filepath = "";
  keyFrameInterval = -1;
  user = "";
  videoid = "";
  totalduration = 0;
  document.getElementById("selected-file").innerHTML = filepath;

  // reset video probed data
  const { initialConfig, initialProbe } = require("./src/Constants");
  ["user", "video"].forEach(prop => {
    Utils.replaceText(`config-${prop}`, initialConfig[prop]);
  });

  for (let prop in initialProbe) {
    if (Object.prototype.hasOwnProperty.call(initialProbe, prop)) {
      Utils.replaceText(`video-${prop}`, initialProbe[prop]);
    }
  }

  // reset status message
  statusMsg.innerText = "Ready";

  // reset progressbar
  progressbar.max = 100;
  progressbar.value = 0;
});

uploadButton.addEventListener("click", event => {
  console.log("upload video");
  if (videoid.length < 5 || user.length < 5) {
    return alert("Invalid video configuration");
  }
  const targetPath = `${Utils.getBasePath(filepath)}/${videoid}`;
  const s3 = require("./src/S3Utils");

  const max = Utils.getFilesCount(targetPath);
  const { videobucket, posterbucket } = require("./src/Constants");
  setStatus("Preparing...", max, 0);
  s3.uploadDir(
    targetPath,
    videobucket,
    posterbucket,
    user,
    videoid,
    max,
    setStatus
  );
});

previewButton.addEventListener("click", event => {
  getPoster(targetFile => shell.openExternal(`file://${targetFile}`));
});

function setStatus(msg, max, val) {
  // reset status message
  statusMsg.innerText = msg;

  // reset progressbar
  progressbar.max = max;
  progressbar.value = val;
}

function getPoster(callback) {
  let time = document.getElementById("time-input").value;
  if (time === "") {
    time = "00:00:01";
  }
  if (videoid.length < 5) {
    return alert("Invalid video configuration");
  }
  if (filepath === "") {
    return alert("Invalid file path");
  }
  const targetPath = `${Utils.getBasePath(filepath)}/${videoid}`;
  cmd.run(`mkdir -p ${targetPath}`);

  const FFMpeg = require("./src/FFMpeg");
  cmd.get(FFMpeg.getThumbnailCmd(time, filepath, videoid), function(
    err,
    data,
    stderr
  ) {
    if (err) {
      alert("Unable to create poster");
    } else {
      const targetFile = `${Utils.getBasePath(
        filepath
      )}/${videoid}/${videoid}.png`;
      if (callback) callback(targetFile);
    }
  });
}
