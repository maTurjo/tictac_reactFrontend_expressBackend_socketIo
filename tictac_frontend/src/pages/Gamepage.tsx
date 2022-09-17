import React from "react";
import { Socket } from "socket.io-client";
import Gamebox from "../components/Gamebox";
interface props{
  socket:Socket
}
const Gamepage = ({socket}:props) => {
  return (
    <div>
      <Gamebox socket={socket}/>
    </div>
  );
};

export default Gamepage;
