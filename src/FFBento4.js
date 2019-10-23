const path = require("path");

// https://github.com/markusdaehn/node-fluent-bento4/blob/master/src/commands/command.js
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
/*
  YouTube recommended encoding settings on ffmpeg (+ libx264)
  https://gist.github.com/mikoim/27e4e0dc64e384adbcb91ff10a2d3678
*/
function getStaticParams(key_frames_interval) {
  const segment_target_duration = require("./Constants")
    .segment_target_duration;

  // static parameters that are similar for all renditions
  let static_params =
    "-c:a aac -ar 48k -c:v h264 -preset slow -profile:v high -crf 20 -movflags +faststart -pix_fmt yuv420p -sc_threshold 0";
  static_params += ` -g ${key_frames_interval} -keyint_min ${key_frames_interval}`;
  return static_params;
}

function getRenditionCmd(key_frames_interval, target) {
  const static_params = getStaticParams(key_frames_interval);
  const {
    renditions,
    max_bitrate_ratio,
    rate_monitor_buffer_ratio
  } = require("./Constants");
  let command = "";
  renditions.forEach(rendition => {
    const { width, height, audio, bitrate } = rendition;
    const maxrate = `${parseInt(bitrate) * max_bitrate_ratio}k`;
    const bufsize = `${parseInt(bitrate) * rate_monitor_buffer_ratio}k`;
    const bandwidth = parseInt(bitrate) * 1000;
    const name = `${height}p`;
    const targetname = path.join(target, name); // .replace(/ /g, '%20');
    command += ` ${static_params} -vf scale=w=-2:h=${height}`;
    command += ` -b:a ${audio} "${targetname}.mp4"`;
  });
  return { command };
}

function generateHLS(target, hash, keyurl) {
  let command = getBento4Cmd("mp4hls");
  const opdir = path.join(target, "export");
  command += ` --signal-session-key --encryption-key="${hash}" --encryption-key-uri="${keyurl}"`;
  command += ` --output-dir="${opdir}" -f`;
  const { renditions } = require("./Constants");
  renditions.forEach(rendition => {
    const { height } = rendition;
    const name = path.join(target, `${height}p.mp4`);
    command += ` "${name}"`;
  });
  console.log(command);
  return command;
}

module.exports = {
  getBento4Cmd,
  getFFmpegCmd,
  getThumbnailCmd,
  getRenditionCmd,
  generateHLS
};
