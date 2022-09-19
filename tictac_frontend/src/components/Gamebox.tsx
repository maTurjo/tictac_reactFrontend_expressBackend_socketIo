import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Socket } from "socket.io-client";
import ScoreBoard from "./ScoreBoard";
import TicTacBox from "./TicTacBox";
import TurnTable from "./TurnTable";

interface props {
  socket: Socket;
}
interface player{
  userId:string,
  userName:string
}


const Gamebox = ({ socket }: props) => {
  const location = useLocation();
  const [gameData, setgameData] = useState<gameData>();
  const player2Name=useRef<HTMLInputElement>(null);
  const clearGame=()=>{
    socket.emit("clearGame",gameData);
  }
  useEffect(() => {
    socket.on("getGameData", (updatedData: gameData) => {
      setgameData(updatedData);
    });
  }, [socket]);
  const joinGame=()=>{
    let player2_Name=player2Name.current?.value;
    let gameId=location.state.gameId;
    if(player2_Name=="") return;
    console.log(player2_Name);
    socket.emit("joinGame",{ gameId,player2Name:player2_Name});
    return;
  }

  if(location.state?.gameId && gameData?.player2.userName ==undefined ){
    return(
      <div>
      <input ref={player2Name} className="border" type="text" placeholder="Set your name" />
      <button  onClick={joinGame} className="bg-green-500 px-2 py-1 cursor-pointer rounded-lg">ENTER</button>
      </div>
    )
  }
  return (
    <div>
      {
        [1].map(()=>{
          if(gameData)return(<div className="flex justify-center items-center">
              <TurnTable gameData={gameData}/>
            <div>
              <ScoreBoard player={gameData.player1} playerScore={gameData.player1WinCount}/>
              <ScoreBoard player={gameData.player2} playerScore={gameData.player2WinCount}/>
            </div>
          </div>)
          else return (<div>waiting for opponent</div>)
        })
      }
      {
        gameData? <TicTacBox gameData={gameData} socket={socket}/>:""
      }
     
      {[0].map(
        ()=>{
          if(gameData){
            let winner=gameData?.winner;
            if(winner)
          return(
          <div>winner is {gameData?.winner?.userName}</div>
          )}
          }
        )}
      <div className="text-start"><button onClick={clearGame} className="bg-red-600 px-2 py-1 text-white rounded-lg">Reset Game</button></div>
    </div>
  );
};

export default Gamebox;
