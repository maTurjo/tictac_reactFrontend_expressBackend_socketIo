import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";

interface gameData {
  listOfConnection: Array<{userId:string,userName:string}>;
  listOfActiveGames:Array<{
    player1:{userId:string,userName:string},
    player2:string,
    gameId:string
    gameMatrix:Array<Array<string>>
  }>
}
interface Props{
  socket:Socket
}

const Activeusers = ({socket}:Props) => {
  const [listOfUsers, setlistOfUsers] = useState<Array<{userId:string,userName:string}>>([]);
  const [gameData, setgameData] = useState<gameData>()
  let navigate=useNavigate();

  useEffect(() => {
    socket.on("UserAddedToList",(upatedData:gameData)=>{
      setgameData(upatedData);
      setlistOfUsers(upatedData.listOfConnection);
      console.log(upatedData)
    })
  }, [socket])

  useEffect(() => {
    var requestOptions:RequestInit = {
      method: 'GET',
      redirect: 'follow'
    };
    
    fetch("http://localhost:4000/api/getActiveUsers", requestOptions)
      .then(response => response.json())
      .then((result:gameData) =>{
        setgameData(result);
        setlistOfUsers(result.listOfConnection);
      })
      .catch(error => console.log('error', error));
  }, [])
  

  const handleChange=(gameId:string)=>{
    navigate('/game',{state:{gameId}});
  }
  
  
  return (
    <div className="mt-5">
      <table className="table-fixed w-100 text-center mx-auto">
        <thead>
          <tr>
            <th className="border px-5">Playername</th>
            <th className="border px-5">In a game</th>
            <th className="border px-5">game Id</th>
            <th className="border px-5"></th>
          </tr>
        </thead>
        <tbody>
          {gameData?.listOfActiveGames.map((item, index) => {
            // if(item.userName=="") return;
            return (
              <tr>
                <td className="border">{item.player1?.userName}</td>
                <td className="border">No</td>
                <td className="border">
                    <button onClick={()=>handleChange(item.gameId)} className="bg-red-600 px-2 py-1 rounded-lg text-white">Challange</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Activeusers;
