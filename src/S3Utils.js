// Import the Amazon S3 service client
const S3 = require("aws-sdk/clients/s3");
const fs = require("fs");
const path = require("path");

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

// https://aws.amazon.com/blogs/security/writing-iam-policies-grant-access-to-user-specific-folders-in-an-amazon-s3-bucket/
module.exports.uploadDir = async function(
  s3Path,
  videobucket,
  posterbucket,
  user,
  video,
  max,
  setStatus
) {
  let progress = 0;
  let errors = 0;

  const accessKeyId = atob(localStorage.getItem("key1"));
  const secretAccessKey = atob(localStorage.getItem("key2"));
  const prefix = `${user}/${video}`;

  // Set credentials and Region
  let s3 = new S3({
    apiVersion: "2006-03-01",
    credentials: {
      accessKeyId,
      secretAccessKey
    }
  });
  const listParams = {
    Bucket: videobucket,
    Prefix: prefix
  };
  await emptyS3Directory(s3, listParams);
  setStatus("Uploading...", max, 0);
  uploadPoster(s3, posterbucket, s3Path, user, video);
  walkSync(s3Path, function(filePath, stat) {
    let bucketPath = `${prefix}/${filePath.substring(s3Path.length + 1)}`;
    let params = {
      Bucket: videobucket,
      Key: bucketPath,
      Body: fs.readFileSync(filePath)
    };
    s3.putObject(params, function(err, data) {
      if (err) {
        errors++;
        console.log(err.message);
      } else {
        console.log(
          "Successfully uploaded " + bucketPath + " to " + videobucket
        );
      }
      if (++progress === max) {
        setStatus(`Uploading done with ${errors} errors`, max, progress);
      } else {
        setStatus(`Uploading ${max - progress} items...`, max, progress);
      }
    });
  });
};

// https://stackoverflow.com/a/48955582/3739896
async function emptyS3Directory(s3, listParams) {
  const listedObjects = await s3.listObjectsV2(listParams).promise();

  if (listedObjects.Contents.length === 0) return;

  const deleteParams = {
    Bucket: listParams.Bucket,
    Delete: { Objects: [] }
  };

  listedObjects.Contents.forEach(({ Key }) => {
    deleteParams.Delete.Objects.push({ Key });
  });

  await s3.deleteObjects(deleteParams).promise();

  if (listedObjects.IsTruncated) await emptyS3Directory(s3, listParams);
}

function uploadPoster(s3, bucketName, filepath, user, video) {
  const imagefile = `${filepath}/${videoid}.png`;

  // Check that the file exists locally
  if (!fs.existsSync(imagefile)) {
    alert("Poster not found");
  } else {
    let fileData = fs.readFileSync(imagefile);
    let bucketPath = `poster/${user}/${video}.png`;
    let params = {
      Bucket: bucketName,
      Key: bucketPath,
      Body: fileData
    };
    s3.putObject(params, function(err, data) {
      if (err) {
        console.log(err);
      } else {
        console.log("Uploaded poster");
      }
    });
  }
}
