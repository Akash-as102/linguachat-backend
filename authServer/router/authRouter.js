const {Router}=require('express');
const authRouter=Router();
const authController= require('../controller/authController')

authRouter.post('/signup',authController.signup)
authRouter.post('/login',authController.login)
authRouter.post('/user',authController.tokenVerify)
authRouter.post('/user/:id',authController.authentication,authController.getUserById)
authRouter.put('/changename',authController.authentication,authController.changeName)
authRouter.put('/changePassword',authController.authentication,authController.changePassword)
authRouter.put('/changeLanguage',authController.authentication,authController.setLanguage)
module.exports=authRouter