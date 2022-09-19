import React from 'react'
import {player,gameData} from "../model/dataModel"


interface props{
    gameData:gameData
}
const TurnTable = (props:props) => {
  return (
    <div>
         <h1 className={props.gameData?.turn==props.gameData?.player1.userId ? "border bg-green-800 text-white":""}>player 1 name: {props.gameData?.player1?.userName} </h1>
            <h1 className={props.gameData?.turn==props.gameData?.player2.userId ? "border bg-green-800 text-white":""}>player 2 name: {props.gameData?.player2?.userName}</h1>
    </div>
  )
}

export default TurnTable