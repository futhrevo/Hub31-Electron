## 4 must-know tips for building cross platform Electron apps

https://blog.avocode.com/4-must-know-tips-for-building-cross-platform-electron-apps-f3ae9c2bffff

Upload entire directory tree to S3 using AWS sdk in node js
https://stackoverflow.com/questions/27670051/upload-entire-directory-tree-to-s3-using-aws-sdk-in-node-js

Photon components
http://photonkit.com/components/

electron-api-demos
https://github.com/electron/electron-api-demos/blob/master/main-process/native-ui/dialogs/open-file.js

Writing IAM Policies: Grant Access to User-Specific Folders in an Amazon S3 Bucket
https://aws.amazon.com/blogs/security/writing-iam-policies-grant-access-to-user-specific-folders-in-an-amazon-s3-bucket/

https://docs.peer5.com/guides/production-ready-hls-vod/
{ "user": "dF7gzMoWr3dPX6YPq", "video": "6qwTPbfkhYzSTj2iN", "hash": "f3f4ad2add3abff924f117aed8065ffb"}

ffmpeg -hide_banner -y -v "quiet" -progress pipe:1 -i "/Users/rakeshkalyankar/Downloads/test hub31.mp4" \
-c:a aac -ar 48000 -c:v h264 -profile:v main -crf 20 -sc_threshold 0 -g 60 -keyint_min 60 -hls_time 4 -hls_enc 1 -hls_enc_key "3e4f9f85499ca321cd0492e0e1ef4fb1" -hls_enc_key_url "http://localhost:3000/hello" -hls_enc_iv 6b6902a15a35ac843a9243627b0063c7 -hls_playlist_type vod -vf scale=w=-2:h=360 -b:v 800k -maxrate 856k -bufsize 1200k -b:a 96k -hls_segment_filename "/Users/rakeshkalyankar/Downloads/cZd5XPeJbENssNRxu/360p*%03d.ts" "/Users/rakeshkalyankar/Downloads/cZd5XPeJbENssNRxu/360p.m3u8" \
-c:a aac -ar 48000 -c:v h264 -profile:v main -crf 20 -sc*threshold 0 -g 60 -keyint_min 60 -hls_time 4 -hls_enc 1 -hls_enc_key "3e4f9f85499ca321cd0492e0e1ef4fb1" -hls_enc_key_url "http://localhost:3000/hello" -hls_enc_iv 6b6902a15a35ac843a9243627b0063c7 -hls_playlist_type vod -vf scale=w=-2:h=480 -b:v 1400k -maxrate 1498k -bufsize 2100k -b:a 128k -hls_segment_filename "/Users/rakeshkalyankar/Downloads/cZd5XPeJbENssNRxu/480p*%03d.ts" "/Users/rakeshkalyankar/Downloads/cZd5XPeJbENssNRxu/480p.m3u8" \
-c:a aac -ar 48000 -c:v h264 -profile:v main -crf 20 -sc*threshold 0 -g 60 -keyint_min 60 -hls_time 4 -hls_enc 1 -hls_enc_key "3e4f9f85499ca321cd0492e0e1ef4fb1" -hls_enc_key_url "http://localhost:3000/hello" -hls_enc_iv 6b6902a15a35ac843a9243627b0063c7 -hls_playlist_type vod -vf scale=w=-2:h=720 -b:v 2800k -maxrate 2996k -bufsize 4200k -b:a 128k -hls_segment_filename "/Users/rakeshkalyankar/Downloads/cZd5XPeJbENssNRxu/720p\*%03d.ts" "/Users/rakeshkalyankar/Downloads/cZd5XPeJbENssNRxu/720p.m3u8"

mp4hls --encryption-key="f3f4ad2add3abff924f117aed8065ffb" --encryption-key-uri="http://localhost:3000/sentry.key" test_hub31_360p.mp4 test_hub31_720p.mp4 test_hub31_1080p.mp4 --exec-dir ../../Bento4-SDK-1-5-1-628.universal-apple-macosx/bin/ --signal-session-key --output-dir=<output-dir>

k1
QUtJQVpVTEg1WElKS0xSWE5EVzI=
k2
Zm8xbHNUa2NFNUZ3em0rV1RhNTc2c0hRSXRoZzJ5M3gwdVZaektkZg==

// https://gist.github.com/mikoim/27e4e0dc64e384adbcb91ff10a2d3678
ffmpeg -hide_banner -y -v "quiet" -progress pipe:1 -i "inputloc" \
-c:a aac -ar 48000 -c:v libx264 -preset slow -profile:v high -crf 20 -movflags +faststart -pix_fmt yuv420p -sc_threshold 0 -g 60 -keyint_min 60 -bf 2
