function getStaticParams(key_frames_interval) {
  const segment_target_duration = require("./Constants")
    .segment_target_duration;

  // static parameters that are similar for all renditions
  let static_params =
    "-c:a aac -ar 48000 -c:v h264 -profile:v main -crf 20 -sc_threshold 0";
  static_params += ` -g ${key_frames_interval} -keyint_min ${key_frames_interval} -hls_time ${segment_target_duration}`;
  static_params += " -hls_playlist_type vod";
  return static_params;
}

module.exports.getRenditionCmd = function(key_frames_interval, target) {
  const static_params = getStaticParams(key_frames_interval);
  const {
    renditions,
    max_bitrate_ratio,
    rate_monitor_buffer_ratio
  } = require("./Constants");
  let master_playlist = "#EXTM3U\n#EXT-X-VERSION:3\n";
  let command = "";
  const path = require("path");
  renditions.forEach(rendition => {
    console.log(rendition);
    const { width, height, audio, bitrate } = rendition;
    const maxrate = `${parseInt(bitrate) * max_bitrate_ratio}k`;
    const bufsize = `${parseInt(bitrate) * rate_monitor_buffer_ratio}k`;
    const bandwidth = parseInt(bitrate) * 1000;
    const name = `${height}p`;
    const targetname = path.join(target, name);
    command += ` ${static_params} -vf scale=w=-2:h=${height}`;
    command += ` -b:v ${bitrate} -maxrate ${maxrate} -bufsize ${bufsize} -b:a ${audio}`;
    command += ` -hls_segment_filename ${targetname}_%03d.ts ${targetname}.m3u8`;

    // add rendition entry in the master playlist
    master_playlist += `#EXT-X-STREAM-INF:BANDWIDTH=${bandwidth},RESOLUTION=${width}x${height}\n${name}.m3u8\n`;
  });
  return { command, master_playlist };
};

module.exports.getThumbnailCmd = function(time, filepath, videoid) {
  const Utils = require("./Utils");
  const targetFile = Utils.getTargetPng(filepath, videoid);
  if (time == null) {
    time = "00:00:01";
  }
  const { posterSize } = require("./Constants.js");
  return `ffmpeg -hide_banner -ss ${time} -i "${filepath}" -y -s ${posterSize} -vframes 1 -f image2 "${targetFile}"`;
};
