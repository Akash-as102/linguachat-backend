const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const prisma = require("../../lib/prisma");

function tokenGenerator(user) {
  return jwt.sign(user, process.env.JWT_ACCESS_KEY);
}
module.exports = {
  signup: async (req, res) => {
    try {
      const { phone, name, password,language } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          name,
          phone: phone.toString(),
          password: hashedPassword,
          language
        },
        select: {
          id: true,
          name: true,
          phone: true,
          language:true
        },
      });
      const accessToken = tokenGenerator({ userId: user.id });
      console.log(user);
      return res.status(201).json({ user, accessToken });
    } catch (err) {
      if (err.code === "P2002") {
        return res.status(409).json({ error: "User Already Exists" });
      }
      return res.status(500).json({ error: err.message });
    }
  },
  login: async (req, res) => {
    try {
      const { phone, password } = req.body;
      const user = await prisma.user.findUnique({
        where: {
          phone: phone.toString(),
        },
      });
      if (!user) return res.status(404).json({ error: "User Not Found" });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ error: "Invalid password" });
      const accessToken = tokenGenerator({ userId: user.id });
      const userData = { id: user.id, name: user.name, phone: user.phone,language:user.language,profileUrl:user.profileUrl };
      return res.status(200).json({ user: userData, accessToken: accessToken });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: err.message });
    }
  },
  authentication: (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.JWT_ACCESS_KEY, (err, user) => {
      if (err) return res.status(401).json({ err });
      req.user = user.userId;
      next();
    });
  },
  tokenVerify: (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    const user = jwt.verify(token, process.env.JWT_ACCESS_KEY);
    return res.status(200).json(user);
  },
  getUserById: async (req, res) => {
    const { userId } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        phone: true,
        language:true
      },
    });
    return res.status(200).json(user);
  },
  changeName: async (req, res) => {
    const user = req.user;
    const updatedUser = await prisma.user.update({
      data: {
        name: req.body.name,
      },
      where: {
        id: user,
      },
      select: {
        id: true,
        name: true,
        phone: true,
      },
    });
    return res.status(200).json({
      message: "Name updated Successfully",
      user: updatedUser,
    });
  },
  changePassword: async (req, res) => {
    const user = req.user;
    const { oldPassword, password } = req.body;
    const old = await prisma.user.findUnique({
      where: {
        id: user,
      },
      select: {
        password: true,
      },
    });
    const isMatch = await bcrypt.compare(oldPassword, old.password);
    if (!isMatch)
      return res.status(400).json({ error: "Invalid Old Password" });
    const hashed = await bcrypt.hash(password, 10);
    const update = await prisma.user.update({
      data: {
        password: hashed,
      },
      where: {
        id: user,
      },
    });
    return res.status(200).json({ message: "Password Updated Successfully" });
  },
  setLanguage:async (req,res)=>{
    const user=req.user;
    const {lang}= req.body;
    const result= await prisma.user.update({
      where:{
        id:user
      },
      data:{
        language:lang
      },
      select:{
        id:true,
        phone:true,
        name:true,
        language:true
      }
    })
    console.log(result)
    return res.status(200).json(result)
  }
};
