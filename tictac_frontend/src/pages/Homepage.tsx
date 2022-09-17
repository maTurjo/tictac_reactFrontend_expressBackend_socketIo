import React, { useEffect } from "react";
import { Socket } from "socket.io-client";
import Activeusers from "../components/Activeusers";
import UsernameBox from "../components/UsernameBox";

interface HomeProps{
  socket:Socket
}

const Homepage = ({socket}:HomeProps) => {
  
  useEffect(() => {
    socket.on("moveIsMade",()=>{
      console.log("Krii");
    })
  }, [socket])
  

  return (
    <div>
      <UsernameBox socket={socket} />
      <Activeusers socket={socket} />
      <h1>{}</h1>
    </div>
  );
};

export default Homepage;
