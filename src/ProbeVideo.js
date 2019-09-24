module.exports.getFFprobeCmd = function(filepath) {
  return `ffprobe -hide_banner -v quiet -print_format json -show_format -show_streams -select_streams v -i "${filepath}"`;
};

module.exports.parseProbe = function(stringdata) {
  const jsondata = JSON.parse(stringdata);
  if (!jsondata) {
    return alert("Invalid Video");
  }
  if (jsondata.streams.length === 0) {
    return alert("Video Stream ot found in video");
  }
  const { width, height, r_frame_rate, duration } = jsondata.streams[0];
  return {
    width,
    height,
    fps: eval(r_frame_rate),
    duration
  };
};

module.exports.getKeyFrameInterval = function(fps = 25) {
  return Math.round(fps * 2);
};
