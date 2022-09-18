import express from "express";
import * as HTTP from "http";
import {Server} from "socket.io";
import cors from "cors";
const app = express();
const PORT = 4000;

// Socket Types START

// Socket Types END


interface IndividualConnection{
  userId:string,
  userName:string
}
interface ActiveGame{
  player1:IndividualConnection,
  player2:IndividualConnection,
  gameId:string,
  turn:string,
  gameMatrix:string[][],

}

// New imports
const http = HTTP.createServer(app);

app.use(cors());
// import { Server } from "socket.io";

// const socketIO = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(http,{
//   cors: {
//     // origin: "http://192.168.0.116:5173",
//     origin: "*",
//   },
// });
const socketIO =new Server(http, {
  cors: {
    // origin: "http://192.168.0.116:5173",
    origin: "*",
  },
});

let listOfConnection:IndividualConnection[]=[];
let listOfActiveGames:ActiveGame[]=[];

// Add this before the app.get() block
socketIO.on("connection", async (socket:any) => {
  listOfConnection.push({userId:socket.id,userName:""});
  console.log(listOfConnection);
  console.log(listOfActiveGames);

  socket.on("UserJoined",({userId,userName}:IndividualConnection)=>{
    let p1;

    listOfConnection.forEach((item,index)=>{
      if(item.userId===userId){
        item.userName=userName;
        p1=item;
      }
    })

    listOfActiveGames.push({player1:p1,player2:null,gameId:Math.random().toString(36).slice(2, 7),gameMatrix:[[],[],[]],turn:""});
    socket.broadcast.emit("UserAddedToList",{listOfConnection,listOfActiveGames});
    console.log(listOfConnection);
  })

  socket.on("joinGame",(gameId:{gameId:string,player2Name:string})=>{
    let requestedGame:ActiveGame;
    let p2:IndividualConnection;
    listOfConnection.forEach((item,index)=>{
      if(item.userId===socket.id) {
        item.userName=gameId.player2Name;
        p2=item
        console.log(gameId.player2Name);
        console.log(item);
      };
    })
    listOfActiveGames.forEach((item,index)=>{
      if(item.gameId===gameId.gameId){
        item.player2=p2;
        requestedGame=item;
      }
    })
    if(requestedGame){
      requestedGame.player2=p2;
      requestedGame.turn=requestedGame.player2.userId;
      console.log(requestedGame);
      socketIO.to(requestedGame.player1.userId).emit("getGameData",requestedGame);
      socket.emit("getGameData",requestedGame);
    }
  })

  socket.on("moveMade",(gameData:ActiveGame)=>{
    const gameId=gameData.gameId;
    let requestedGame:ActiveGame;
    listOfActiveGames.forEach((item,index)=>{
      if(item.gameId===gameId){
        item.gameMatrix=gameData.gameMatrix;
        item.turn=gameData.turn;
        requestedGame=item;
      }
    })
    if(requestedGame){
      socketIO.to(requestedGame.player1.userId).emit("getGameData",requestedGame);
      socketIO.to(requestedGame.player2.userId).emit("getGameData",requestedGame);
    }

  })

  socket.on("clearGame",(gameData:ActiveGame)=>{
    const gameId=gameData.gameId;
    let requestedGame:ActiveGame;
    listOfActiveGames.forEach((item,index)=>{
      if(item.gameId===gameId){
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
    const modifiedArray=listOfConnection.filter((item,index)=>{
      if(item.userId!==socket.id) return true;
      else return false;
    })
    listOfConnection=modifiedArray;

    const modifiedGameArray=listOfActiveGames.filter((item,index)=>{
      if(item.player1?.userId!==socket.id) return true;
      else return false;
    });
    listOfActiveGames=modifiedGameArray;
    socket.broadcast.emit("UserAddedToList",{listOfConnection,listOfActiveGames});
    console.log(listOfConnection)
    console.log("🔥: A user disconnected");
  });

});

app.get("/api/getActiveUsers", (req, res) => {
  socketIO.emit("UserAddedToList",{listOfConnection,listOfActiveGames});
  res.json({
    listOfActiveGames,
    listOfConnection
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
