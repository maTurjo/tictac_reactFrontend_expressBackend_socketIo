import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import {Routes,Route} from "react-router-dom"
import Homepage from './pages/Homepage'
import Gamepage from './pages/Gamepage'
import socketIO from 'socket.io-client';

const socket = socketIO('http://localhost:4000');

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Routes>
        {/* <Route path="/" element={Homepage(socket)}/> */}
        <Route path="/" element={<Homepage socket={socket}/>}/>
        <Route path="/game" element={<Gamepage socket={socket}/>}/>
      </Routes>
    </div>
  )
}

export default App
