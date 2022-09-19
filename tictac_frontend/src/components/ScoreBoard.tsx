import React from 'react'
import {player} from "../model/dataModel"

interface props{
    player:player,
    playerScore:number
}


const ScoreBoard = (props:props) => {
  return (
    <div>
        <h2 className="text-red-500 font-bold text-2xl">{props.player.userName}-{props.playerScore}</h2>
    </div>
  )
}

export default ScoreBoard