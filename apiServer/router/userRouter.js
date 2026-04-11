const {Router}=require('express');
const userRouter=Router();
const userController= require('../controller/userController')
const upload = require("../middleware/upload.middleware");
const audio = require("../middleware/audio.middleware");
const authController=require("../../authServer/controller/authController")

userRouter.post('/profilePic',authController.authentication,upload.single('image'),userController.setProfilePic)
userRouter.post('/deleteProfilePic',authController.authentication,userController.deleteProfilePic)
userRouter.get('/profilePic/:id',userController.getProfileUrl)
userRouter.post('/deleteMessage',userController.deleteMessage)
userRouter.post('/uploadAudio',audio.single('audio'),userController.uploadAudio)
module.exports=userRouter