const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");

const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
});

app.use(cors());

 const PORT = process.env.PORT || 5000 

 app.get("/", (req,res) => {
    res.send("Server is running");
 });

 io.on("connection",(socket) => {
    socket.on("createRoom",(roomID,callback) =>{
      socket.join(roomID)

      if (typeof callback === "function") {
        callback({ success: true, message: `Successfully joined room ${roomID}` });
      }
    });

    socket.on("joinRoom",roomID =>{
      socket.join(roomID)
    });

    
    socket.emit("me",socket.id)

    socket.on("disconnect",()=>{
      socket.broadcast.emit('callEnded') 
    })

    socket.on("callUser",({userToCall, signalData, from, name})=>{
        io.to(userToCall).emit("callUser", {signal: signalData,from,name})
    })

    socket.on("answerCall", ()=> {
      io.to(data.to).emit("callAccepted", data.signal )
    })
 })

 server.listen(PORT, ()=>{
  console.log(`Server is listening ${PORT }`)
 })