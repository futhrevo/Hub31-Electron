// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const { ipcRenderer } = require("electron");
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

ipcRenderer.on("selected-video-file", (event, path) => {
  if (path.length > 0) {
    filepath = path[0];
    cmd.get(FFProbe.getFFprobeCmd(filepath), function(err, data, stderr) {
      const probedData = FFProbe.parseProbe(data);
      totalduration = probedData.duration;
      Utils.setMaxProgress(progressbar, totalduration);
      console.log(totalduration);
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
  processRef = cmd.get(`ffmpeg ${misc_params} -i ${filepath} ${command}`);
  //listen to the python terminal output
  processRef.stdout.on("data", function(data) {
    Utils.setProgress(statusMsg, progressbar, data);
  });

  processRef.stderr.on("data", function(data) {
    console.log(data);
  });
});

stopButton.addEventListener("click", event => {
  console.log(processRef.pid);
  process.kill(processRef.pid, "SIGINT");
});
