const { Storage } = require("@google-cloud/storage");
const speech = require("@google-cloud/speech");

// ✅ parse credentials from env
const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);

const storage = new Storage({
  credentials,
  projectId: credentials.project_id,
});

const speechClient = new speech.SpeechClient({
  credentials,
});

const bucketName = "linguachat-audio";
const bucket = storage.bucket(bucketName);

module.exports = { storage, speechClient, bucket, bucketName };