import Navbar from '../components/Navbar';
import './Home.css'
import React from 'react';
import SudokuGrid from '../components/SudokuGrid'

function Home(){



    return(
        <div className="home-container">
            <Navbar/>
            <h1><span className="s">S</span><span className="u">U</span><span className="d">D</span><span className="o">O</span><span className="k">K</span><span className="u2">U</span></h1>
            <span className="line"></span>
            <div className="btns">
                <button className="play">PLAY</button>
                <button className="solve">SOLVER</button>
            </div>
        </div>

    )
}

export default Home;