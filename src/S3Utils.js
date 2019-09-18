// Import the Amazon S3 service client
const S3 = require("aws-sdk/clients/s3");
const fs = require("fs");
const path = require("path");

// Set credentials and Region
let s3 = new S3({
  apiVersion: "2006-03-01",
  credentials: {
    accessKeyId: "AKIAZULH5XIJKLRXNDW2",
    secretAccessKey: "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"
  }
});

function walkSync(currentDirPath, callback) {
  fs.readdirSync(currentDirPath).forEach(function(name) {
    if ([".ts", ".m3u8"].indexOf(path.extname(name)) > -1) {
      const filePath = path.join(currentDirPath, name);
      const stat = fs.statSync(filePath);
      if (stat.isFile()) {
        callback(filePath, stat);
      }
    }
  });
}

module.exports.uploadDir = function(s3Path, bucketName, user, video) {
  console.log("uplod Dir started");

  walkSync(s3Path, function(filePath, stat) {
    let bucketPath = `${user}/${video}/${filePath.substring(
      s3Path.length + 1
    )}`;
    let params = {
      Bucket: bucketName,
      Key: bucketPath,
      Body: fs.readFileSync(filePath)
    };
    s3.putObject(params, function(err, data) {
      if (err) {
        console.log(err.message);
      } else {
        console.log(
          "Successfully uploaded " + bucketPath + " to " + bucketName
        );
      }
    });
  });
};
