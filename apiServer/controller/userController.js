const prisma=require('../../lib/prisma')
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { speechClient } = require("../lib/googleCloud");
const uploadToGCS =require('../lib/uploadToGCS')
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
const os=require('os')

ffmpeg.setFfmpegPath(ffmpegPath);

// helper: convert to wav
const convertToWav = (inputPath, outputPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .audioCodec("pcm_s16le") // LINEAR16
      .audioChannels(1)        // mono
      .audioFrequency(16000)   // 16kHz
      .format("wav")
      .on("end", () => resolve(outputPath))
      .on("error", (err) => reject(err))
      .save(outputPath);
  });
};

module.exports={
    setProfilePic: async (req,res)=>{
        try {
            if(!req.file){
                return res.status(400).json({error:"No image uploaded"});
            }
            const userId=req.user;
            const finalFilename=`user_${userId}.webp`
            const finalPath=path.join('uploads/profilePics',finalFilename);
            const imageUrl=`/static/profilePics/${finalFilename}`

            fs.mkdirSync(path.dirname(finalPath),{recursive:true})
            fs.renameSync(req.file.path,finalPath);
            const result=await prisma.user.update({
                where:{id:userId},
                data:{
                    profileUrl:imageUrl
                }
            })
            return res.status(200).json({
                profilePic:imageUrl
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({error:"Upload Failed"})
        }
    },
    deleteProfilePic:async (req,res)=>{
        try {
            const userId=req.user;
            const finalFilename=`user_${userId}.webp`
            const filePath=path.join('uploads/profilePics',finalFilename)

            if(fs.existsSync(filePath)){
                fs.unlinkSync(filePath)
            }

            await prisma.user.update({
                where:{id:userId},
                data:{profileUrl:null}
            })
            return res.status(200).json({message:"Profile photo deleted"})
            
        } catch (error) {
            res.status(500).json({error:"Delete failed"})
        }
    },
    getProfileUrl:async (req,res)=>{
        const {id}=req.params
        const url=await prisma.user.findUnique({
            where:{id:parseInt(id)},
            select:{
                profileUrl:true
            }
        })
        res.status(200).json(url)
    },
    deleteMessage:async (req,res)=>{
        const {id}=req.body
        const result=await prisma.message.update({
            where:{
                id
            },
            data:{
                text:"Message Deleted",
                audioUrl:null,
                messageType:'TEXT'
            }
        })
        console.log(result);
        return res.status(200).json(result)
    },
    uploadAudio: async (req,res)=>{
          try {
            if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
            }

            const language = req.body?.language || "en-IN";

            const inputPath = path.join(os.tmpdir(), `${Date.now()}-input`);
            const outputPath = path.join(os.tmpdir(), `${Date.now()}-output.wav`);

            fs.writeFileSync(inputPath, req.file.buffer);

            // 🔥 STEP 1: Convert audio to WAV
            await convertToWav(inputPath, outputPath);

            // 🔥 STEP 2: Upload converted file to GCS
            const wavBuffer = fs.readFileSync(outputPath);

            const { gcsUri, publicUrl } = await uploadToGCS({
            buffer: wavBuffer,
            mimetype: "audio/wav",
            originalname: "audio.wav",
            });

            // 🔥 STEP 3: Send to Speech API
            const request = {
            audio: {
                uri: gcsUri,
            },
            config: {
                encoding: "LINEAR16",
                sampleRateHertz: 16000,
                languageCode: language,
            },
            };

            const [response] = await speechClient.recognize(request);

            const transcription = response.results
            .map((r) => r.alternatives[0].transcript)
            .join("\n");

            // 🔥 STEP 4: Cleanup temp files
            fs.unlinkSync(inputPath);
            fs.unlinkSync(outputPath);

            res.json({
            audioUrl: publicUrl,
            text: transcription,
            });

        } catch (err) {
            console.error("UPLOAD ERROR:", err);
            res.status(500).json({ error: err.message });
        }
    },
}