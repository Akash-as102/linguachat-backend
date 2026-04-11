const multer=require('multer');
const path= require('path');
const {v4:uuidv4}=require('uuid')

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/profilePics')
    },
    filename:(req,file,cb)=>{
        const ext=path.extname(file.originalname);
        cb(null,`tmp_${uuidv4()}${ext}`);
    }
})

const fileFilter=(req,file,cb)=>{
    const allowed= ['image/jpeg','image/png','image/webp']
    allowed.includes(file.mimetype)?cb(null,true): cb(new Error("Invalid file type"),false)
};
const upload=multer({
    storage,
    fileFilter,
    limits:{fileSize:2*1024*1024}
});

module.exports=upload