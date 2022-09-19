import React from 'react'
import { Socket } from 'socket.io-client';
import {player,gameData} from "../model/dataModel"

interface props{
    gameData:gameData
    socket:Socket
}

const TicTacBox = (props:props) => {

    const makeMove = async (position1: number, position2: number) => {
        console.log("made move invoked");
        console.log(`socket id ${props.socket.id}`);
        console.log(`turn ${props.gameData?.turn}`);
        if (props.gameData?.player2 && props.gameData.turn == props.socket.id) {
          console.log("made move invoked in condition");
          let mark: string;
          if (props.gameData.player1.userId == props.socket.id) mark = "0";
          else mark = "X";
          let locaMatrix = [...props.gameData.gameMatrix];
          locaMatrix[position1][position2] = mark;
        //   setgameMatrix([...locaMatrix]);
          let localGameData: gameData = Object.assign({}, props.gameData);
          localGameData.gameMatrix = props.gameData.gameMatrix;
          if (localGameData.turn == localGameData.player1.userId) {
            localGameData.turn = props.gameData.player2.userId;
          } else {
            localGameData.turn = props.gameData.player1.userId;
          }
        //   setgameData(() => localGameData);
          props.socket.emit("moveMade", localGameData);
        }
      };
  return (
    <div>
         <div className="w-[300px] h-[300px]">
        <div className="border-b h-[100px] flex items-end">
          <div
            className="w-[100px] h-[100%]  flex items-center justify-center border-r "
            onClick={() => makeMove(0, 0)}
          >
            {props.gameData.gameMatrix[0][0]}
          </div>
          <div
            className="w-[100px] h-[100%]  flex items-center justify-center border-r"
            onClick={() => makeMove(0, 1)}
          >
            {props.gameData.gameMatrix[0][1]}
          </div>
          <div
            className="w-[100px] h-[100%]  flex items-center justify-center"
            onClick={() => makeMove(0, 2)}
          >
            {props.gameData.gameMatrix[0][2]}
          </div>
        </div>
        <div className="h-[100px] flex">
          <div
            className="w-[100px] h-[100%]  flex items-center justify-center border-r "
            onClick={() => makeMove(1, 0)}
          >
            {props.gameData.gameMatrix[1][0]}
          </div>
          <div
            className="w-[100px] h-[100%]  flex items-center justify-center border-r"
            onClick={() => makeMove(1, 1)}
          >
            {props.gameData.gameMatrix[1][1]}
          </div>
          <div
            className="w-[100px] h-[100%]  flex items-center justify-center"
            onClick={() => makeMove(1, 2)}
          >
            {props.gameData.gameMatrix[1][2]}
          </div>
        </div>
        <div className="border-t h-[100px] flex">
          <div
            className="w-[100px] h-[100%]  flex items-center justify-center border-r "
            onClick={() => makeMove(2, 0)}
          >
            {props.gameData.gameMatrix[2][0]}
          </div>
          <div
            className="w-[100px] h-[100%]  flex items-center justify-center border-r"
            onClick={() => makeMove(2, 1)}
          >
            {props.gameData.gameMatrix[2][1]}
          </div>
          <div
            className="w-[100px] h-[100%]  flex items-center justify-center"
            onClick={() => makeMove(2, 2)}
          >
            {props.gameData.gameMatrix[2][2]}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TicTacBox