const path = require("path");

function getBento4Cmd(cmdtype) {
  const DEFAULT_BIN =
    process.env.BENTO4_BIN || localStorage.getItem("bento4-path") || "";
  if (DEFAULT_BIN === "") {
    return alert("Bento path not found");
  }
  const filename = `${cmdtype.toLowerCase()}${
    process.platform === "win32" ? ".exe" : ""
  }`;
  return path.join(DEFAULT_BIN, filename);
}

function getFFmpegCmd(cmdtype) {
  let DEFAULT_BIN = "";
  if (cmdtype.toLowerCase() === "ffprobe") {
    DEFAULT_BIN =
      process.env.FFPROBE_PATH || localStorage.getItem("ffmpeg-path") || "";
  } else {
    DEFAULT_BIN =
      process.env.FFMPEG_PATH || localStorage.getItem("ffmpeg-path") || "";
  }
  if (DEFAULT_BIN === "") {
    return alert("FFmpeg path not found");
  }
  const filename = `${cmdtype.toLowerCase()}${
    process.platform === "win32" ? ".exe" : ""
  }`;
  return path.join(DEFAULT_BIN, filename);
}

function getThumbnailCmd(time, filepath, videoid) {
  const Utils = require("./Utils");
  const targetFile = Utils.getTargetPng(filepath, videoid);
  if (time == null) {
    time = "00:00:01";
  }
  const { posterSize } = require("./Constants.js");
  return `${getFFmpegCmd(
    "ffmpeg"
  )} -hide_banner -ss ${time} -i "${filepath}" -y -s ${posterSize} -vframes 1 -f image2 "${targetFile}"`;
}
