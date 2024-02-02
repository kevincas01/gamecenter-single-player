import {
  Routes,
  Route
} from "react-router-dom";
import GameCenter from "./Components/GameCenter";

import  './App.css'

function App() {

  return(
    

      <Routes>
        <Route path='/' element={<GameCenter/>} />
        <Route path='/wordle' element={<GameCenter/>} />
        <Route path='/connections' element={<GameCenter/>} />
        
      </Routes>
    
  )
}

export default App;
