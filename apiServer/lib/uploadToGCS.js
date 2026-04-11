const { bucket, bucketName } = require("../lib/googleCloud");

async function uploadToGCS(file) {
  const fileName = `audio/${Date.now()}.m4a`;
  const blob = bucket.file(fileName);

  await blob.save(file.buffer, {
    contentType: file.mimetype,
  });

  return {
    gcsUri: `gs://${bucketName}/${fileName}`,
    publicUrl: `https://storage.googleapis.com/${bucketName}/${fileName}`,
    fileName,
  };
}

module.exports = uploadToGCS;