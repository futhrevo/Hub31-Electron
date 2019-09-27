module.exports = {
  rooturl: "https://hub31.com/sentry",
  videobucket: "hubacca",
  posterbucket: "hub31.com",
  misc_params: '-hide_banner -y -v "quiet" -progress pipe:1',
  segment_target_duration: 4, // try to create a new segment every X seconds
  max_bitrate_ratio: 1.07, // maximum accepted bitrate fluctuations
  rate_monitor_buffer_ratio: 1.5, // maximum buffer size between bitrate conformance checks
  posterSize: "854x480",
  renditions: [
    {
      width: 640, //WIDTH
      height: 360, // height
      bitrate: "800k", // refer to table @ https://docs.peer5.com/guides/production-ready-hls-vod/
      audio: "96k"
    }, // 360p
    {
      width: 854, //WIDTH
      height: 480, // height
      bitrate: "1400k", // refer to table @ https://docs.peer5.com/guides/production-ready-hls-vod/
      audio: "128k"
    }, // 480p
    {
      width: 1280, //WIDTH
      height: 720, // height
      bitrate: "2800k", // refer to table @ https://docs.peer5.com/guides/production-ready-hls-vod/
      audio: "128k"
    } //720p
    // {
    //   width: 1920, //WIDTH
    //   height: 1080, // height
    //   bitrate: "5000k" // refer to table @ https://docs.peer5.com/guides/production-ready-hls-vod/
    //   audio: '192k'
    // } // 1080p
  ],
  initialProbe: {
    width: "",
    height: "",
    fps: "",
    duration: ""
  },
  initialConfig: {
    user: "",
    video: ""
  }
};
