const { Storage } = require("@google-cloud/storage");
const speech = require("@google-cloud/speech");

// 🔥 Uses env variable automatically
const storage = new Storage();
const speechClient = new speech.SpeechClient();

const bucketName = "linguachat-audio";
const bucket = storage.bucket(bucketName);

module.exports = { storage, speechClient, bucket, bucketName };