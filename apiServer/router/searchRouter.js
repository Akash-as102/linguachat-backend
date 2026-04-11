const {Router}=require('express');
const searchRouter=Router();
const searchController= require('../controller/searchController')

searchRouter.get('/searchByPhone/:phone',searchController.searchByPhone)
searchRouter.get("/searchId/:id",searchController.searchUserById)

module.exports=searchRouter