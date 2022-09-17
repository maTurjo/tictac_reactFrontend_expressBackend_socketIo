const express = require("express");
const app = express();
const PORT = 4000;

//New imports
const http = require("http").Server(app);
const cors = require("cors");

app.use(cors());

const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://127.0.0.1:5173",
  },
});

let listOfConnection=[];
let listOfActiveGames=[];

//Add this before the app.get() block
socketIO.on("connection", async (socket) => {
  listOfConnection.push({userId:socket.id,userName:""});
  console.log(listOfConnection);
  console.log(listOfActiveGames);

  socket.on("UserJoined",({userId,userName})=>{
    let p1;

    listOfConnection.forEach((item,index)=>{
      if(item.userId==userId){
        item.userName=userName;
        p1=item;
      }
    })


    listOfActiveGames.push({player1:p1,player2:"",gameId:Math.random().toString(36).slice(2, 7),gameMatrix:[[],[],[]],turn:""});
    socket.broadcast.emit("UserAddedToList",{listOfConnection,listOfActiveGames});
    console.log(listOfConnection);
  })

  socket.on("joinGame",(gameId)=>{
    let requestedGame;
    listOfActiveGames.map((item,index)=>{
      if(item.gameId==gameId.gameId){
        requestedGame=item;
      }
    })
    let p2;
    listOfConnection.map((item,index)=>{
      if(item.userId==socket.id) p2=item;
    })
    requestedGame.player2=p2;
    requestedGame.turn=requestedGame.player2.userId;
    console.log(requestedGame);
    socket.emit("getGameData",requestedGame);
  })

  socket.on("moveMade",(gameData)=>{
    let gameId=gameData.gameId;
    let requestedGame;
    listOfActiveGames.forEach((item,index)=>{
      if(item.gameId==gameId){
        item.gameMatrix=gameData.gameMatrix;
        item.turn=gameData.turn;
        requestedGame=item;
      }
    })

    socketIO.to(requestedGame.player1.userId).emit("getGameData",requestedGame);
    socketIO.to(requestedGame.player2.userId).emit("getGameData",requestedGame);
    
  })

  socket.on("clearGame",(gameData)=>{
    let gameId=gameData.gameId;
    let requestedGame;
    listOfActiveGames.forEach((item,index)=>{
      if(item.gameId==gameId){
        item.gameMatrix=[[],[],[]];
        item.turn=gameData.turn;
        requestedGame=item;
      }
    })
    socketIO.to(requestedGame.player1.userId).emit("getGameData",requestedGame);
    socketIO.to(requestedGame.player2.userId).emit("getGameData",requestedGame);
  })

  // console.log(`⚡: ${socket.id} user just connected!`);
  
  socket.on("disconnect", () => {
    let modifiedArray=listOfConnection.filter((item,index)=>{
      if(item.userId!=socket.id) return true;
      else return false;
    })
    listOfConnection=modifiedArray;

    let modifiedGameArray=listOfActiveGames.filter((item,index)=>{
      if(item.player1?.userId!=socket.id) return true;
      else return false;
    });
    listOfActiveGames=modifiedGameArray;
    socket.broadcast.emit("UserAddedToList",{listOfConnection,listOfActiveGames});
    console.log(listOfConnection)
    console.log("🔥: A user disconnected");
  });

 
});



app.get("/api", (req, res) => {
  res.json({
    message: "Hello world",
  });
});





http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
