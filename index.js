const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const prisma=require('./lib/prisma')


const app = express();

// middlewares
app.use(require("cors")({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static("uploads"));
app.use('/uploads/audio',express.static("uploads/audio"))

// routes
const authRouter = require("./authServer/router/authRouter");
const searchRouter = require("./apiServer/router/searchRouter");
const userRouter = require("./apiServer/router/userRouter");

// use routes
app.use("/auth", authRouter);
app.use("/search", searchRouter);
app.use("/user", userRouter);
app.get("/test",async (req,res)=>{
  const users = await prisma.user.findMany();
  res.json(users);
})

// cache fix (from apiServer)
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

// create server for socket.io
const server = http.createServer(app);

// socket setup
const io = new Server(server, {
  cors: { origin: "*" },
});

// socket handler
const socketHandler = require("./apiServer/lib/Socket");
socketHandler(io);

// test route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// port
const PORT = process.env.PORT || 5000;

// start server
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});