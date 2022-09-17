import React, { useRef } from "react";
import {useNavigate} from 'react-router-dom';
import { Socket } from "socket.io-client";
interface Props{
  socket:Socket
}
const UsernameBox = ({socket}:Props) => {

  const navigate=useNavigate();
  const playerNameRef=useRef<HTMLInputElement>(null);
  const handdleNameSubmission=(e:React.MouseEvent<HTMLButtonElement>)=>{
    let inputValue=playerNameRef.current?.value;
    if(inputValue==""){
      playerNameRef.current?.classList.add("border-red-600");
      return;
    }
    else {
      socket.emit('UserJoined',{userId:socket.id,userName:inputValue})
      navigate("/game");
    }
  }
  const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
    let inputValue=playerNameRef.current?.value;
    if(inputValue!=""){
      playerNameRef.current?.classList.remove("border-red-600");
    }
  }
  return (
    <div>
      <div>
        <input
          onChange={handleChange}
          ref={playerNameRef}
          className="border text-center rounded-lg"
          type="text"
          placeholder="Player Name"
        />
      </div>
      <div>
        <button onClick={handdleNameSubmission} className="bg-green-600 px-3 py-1 rounded-lg mt-2 text-white">
          Match
        </button>
      </div>
    </div>
  );
};

export default UsernameBox;
