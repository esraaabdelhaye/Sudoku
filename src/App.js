import Home from './Pages/Home'
import {Routes, Route } from "react-router-dom";
import Maker from './Pages/Maker'
import Solver from './Pages/Solver'


function App() {
  return (
    <div className="App">
      <Routes>


      <Route  element={<Home/>} path='/' />
      <Route  element={<Maker/>} path='/Maker' />
      <Route  element={<Solver/>} path='/Solver' />

      </Routes>
    </div>
  )
}

export default App;
