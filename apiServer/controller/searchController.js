const prisma=require('../../lib/prisma')

module.exports={
    searchByPhone:async (req,res)=>{
        const {phone}= req.params;
        const user=await prisma.user.findUnique({
            where:{
                phone
            },
            select:{
                id:true,
                name:true,
                phone:true,
                profileUrl:true
            }
        })
        if(!user) return res.status(404).json({message:"User Not Found"})
        return res.status(200).json(user);
    },
    searchUserById: async (req,res)=>{
        const {id}= req.params;

        const user=await prisma.user.findUnique({
            where:{
                id:parseInt(id)
            },
            select:{
                id:true,
                name:true,
                phone:true,
            }
        })
        if(!user) return res.status(404).json({message:"User Not Found"})
        return res.status(200).json(user);
    }
}