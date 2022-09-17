import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Socket } from "socket.io-client";

interface props {
  socket: Socket;
}

interface gameData {
  player1: { userId: string; userName: string };
  player2: { userId: string; userName: string };
  gameid: string;
  turn: string;
  gameMatrix: Array<Array<string>>;
}
const Gamebox = ({ socket }: props) => {
  const location = useLocation();
  const [player1, setplayer1] = useState(location.state?.opponentId);
  const [gameData, setgameData] = useState<gameData>();
  const [gameMatrix, setgameMatrix] = useState<Array<Array<string>>>([
    [],
    [],
    [],
  ]);
  const [playerOneTurn, setplayerOneTurn] = useState<boolean>(true);

  const makeMove = async (position1: number, position2: number) => {
    console.log("made move invoked");
    console.log(`socket id ${socket.id}`);
    console.log(`turn ${gameData?.turn}`);
    if (gameData?.player2 && gameData.turn == socket.id) {
      console.log("made move invoked in condition");
      let mark: string;
      if (gameData.player1.userId == socket.id) mark = "0";
      else mark = "X";
      let locaMatrix = [...gameMatrix];
      locaMatrix[position1][position2] = mark;
      setgameMatrix([...locaMatrix]);
      let localGameData: gameData = Object.assign({}, gameData);
      localGameData.gameMatrix = gameMatrix;
      if (localGameData.turn == localGameData.player1.userId) {
        localGameData.turn = gameData.player2.userId;
      } else {
        localGameData.turn = gameData.player1.userId;
      }
      setgameData(() => localGameData);
      socket.emit("moveMade", localGameData);
    }
  };

  const clearGame=()=>{
    socket.emit("clearGame",gameData);
  }

  useEffect(() => {
    socket.on("getGameData", (updatedData: gameData) => {
      setgameData(updatedData);
      setgameMatrix(updatedData.gameMatrix);
      console.log(updatedData);
    });
  }, [socket]);

  useEffect(() => {
    if (location.state?.gameId) {
      socket.emit("joinGame", { gameId: location.state.gameId });
    }
  }, []);

  return (
    <div>
      <div>
        <h1>player 1 name: {gameData?.player1?.userName}</h1>
        <h1>player 2 name: {gameData?.player2?.userName}</h1>
      </div>
      <div className="w-[300px] h-[300px]">
        <div className="border-b h-[100px] flex items-end">
          <div
            className="w-[100px] h-[100%]  flex items-center justify-center border-r "
            onClick={() => makeMove(0, 0)}
          >
            {gameMatrix[0][0]}
          </div>
          <div
            className="w-[100px] h-[100%]  flex items-center justify-center border-r"
            onClick={() => makeMove(0, 1)}
          >
            {gameMatrix[0][1]}
          </div>
          <div
            className="w-[100px] h-[100%]  flex items-center justify-center"
            onClick={() => makeMove(0, 2)}
          >
            {gameMatrix[0][2]}
          </div>
        </div>
        <div className="h-[100px] flex">
          <div
            className="w-[100px] h-[100%]  flex items-center justify-center border-r "
            onClick={() => makeMove(1, 0)}
          >
            {gameMatrix[1][0]}
          </div>
          <div
            className="w-[100px] h-[100%]  flex items-center justify-center border-r"
            onClick={() => makeMove(1, 1)}
          >
            {gameMatrix[1][1]}
          </div>
          <div
            className="w-[100px] h-[100%]  flex items-center justify-center"
            onClick={() => makeMove(1, 2)}
          >
            {gameMatrix[1][2]}
          </div>
        </div>
        <div className="border-t h-[100px] flex">
          <div
            className="w-[100px] h-[100%]  flex items-center justify-center border-r "
            onClick={() => makeMove(2, 0)}
          >
            {gameMatrix[2][0]}
          </div>
          <div
            className="w-[100px] h-[100%]  flex items-center justify-center border-r"
            onClick={() => makeMove(2, 1)}
          >
            {gameMatrix[2][1]}
          </div>
          <div
            className="w-[100px] h-[100%]  flex items-center justify-center"
            onClick={() => makeMove(2, 2)}
          >
            {gameMatrix[2][2]}
          </div>
        </div>
      </div>
      <div className="text-start"><button onClick={clearGame} className="bg-red-600 px-2 py-1 text-white rounded-lg">Reset Game</button></div>
    </div>
  );
};

export default Gamebox;
