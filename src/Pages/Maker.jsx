
import {useLocation} from 'react-router-dom'
import React, { useState } from 'react'
import SudokuGrid from '../components/SudokuGrid';
import Controlers from '../components/Controlers';
import './Maker.css'
import {Link} from 'react-router-dom';
import pencilaudio from '../audio/pencil_sound.mp3'
import eraseraudio from '../audio/eraser2.mp3'
import knockaudio from '../audio/knock.mp3'

export function Maker(){
    let hintsCount ;
    const [reRender , setRender] = useState(true)
    // Getting The Difficulty Level 
    // const info = useLocation()
    const [level , setLevel] = useState('easy');

    // Fetching The Sudoku 
    React.useEffect(()=>{
        console.log(level);
        fetch(`https://sugoku.herokuapp.com/board?difficulty=${level}`)
        .then(response=> response.json())
        .then(data => displaySudoku(data))
        .catch(error => console.error(error))
        window.addEventListener('keydown' , keyPressed)       // When You Click On A Number
        window.addEventListener('click', function(e){         // Removing The Focus Effect When You Click Outside The Grid
            if (!document.querySelector('.grid').contains(e.target) && prevInputId){
                document.getElementById(`${prevInputId}`).classList.remove('focus')
            }
          });
        return () => {
            window.removeEventListener('keydown' , keyPressed)
        };
    })


    // Adding Focus Class On The Selected Input 
    let prevInputId;
    function focusInput(e){
        if(prevInputId){
            document.getElementById(`${prevInputId}`).classList.remove('focus')
        }
        document.getElementById(`${e.target.id}`).classList.add('focus')
        prevInputId = e.target.id;
    }

    // Gettting The Typing Number And Displaying It On The Screen
    function NumberClicked(e){
        const input = document.getElementById(`${prevInputId}`)
        if(!input.classList.contains('done')){
            if((e.target.id==='' && input.classList.contains('right')) || (e.target.id==='' && input.classList.contains('wrong'))){
                input.classList.remove('wrong')
                input.classList.remove('right')
                new Audio(eraseraudio).play()
            }
            else if(e.target.id!==''){
                new Audio(pencilaudio).play()
                rightOrWrong(input)
            }else 
                new Audio(knockaudio).play()
            input.textContent = e.target.id;

        }
    }

    // Getting The Number From The Keyboard And Displaying It 
    function keyPressed(e){

        const input = document.getElementById(`${prevInputId}`)
        if(prevInputId && e.keyCode <= 57 && e.keyCode>=49 && !input.classList.contains('done')){
            input.textContent = e.key;
            rightOrWrong(input)
        }else if(prevInputId && e.keyCode == '8'){
            input.textContent=''
        }
    }

    // Displaying The Sudoku On The Grid 
    function displaySudoku(data){
        solve(data)
        const board = data.board;
        for(let i=0; i<board.length; i++){
            for(let n=0; n<board[i].length; n++){
                if(board[i][n]!='0'){
                    const input = document.getElementById(`${i}${n}`);
                    input.textContent = board[i][n];
                    input.classList.add('done');
                }else{
                    const input = document.getElementById(`${i}${n}`);
                    input.textContent = '';
                    input.classList.remove('done')
                }
            }
        }
    }

    // Solving The Given Sudoku 
    const encodeBoard = (board) => board.reduce((result, row, i) => result + `%5B${encodeURIComponent(row)}%5D${i === board.length -1 ? '' : '%2C'}`, '')
    const encodeParams = (params) => 
    Object.keys(params)
    .map(key => key + '=' + `%5B${encodeBoard(params[key])}%5D`)
    .join('&');

    // Solving The Sudoku 
    let solution ;
    function solve(data){
        const options = {
            method:'POST',
            body: encodeParams(data),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }

        fetch('https://sugoku.herokuapp.com/solve', options)
        .then(response => response.json())
        .then(response => solution = response.solution)
        .catch(console.warn)
    }

    // Checking The Answer Is right Or Wrong 
    function rightOrWrong(input){
        console.log(solution);
        if(input.textContent == solution[input.id[0]][input.id[1]]){
            input.classList.add('right')
            input.classList.remove('wrong')
        }else{
            const mistakesPlace = document.querySelector('.mistakes-span')
            const mistakes = parseInt(mistakesPlace.textContent);
            mistakesPlace.textContent= mistakes+1;
            input.classList.remove('right')
            input.classList.add('wrong')
        }
    }

    // Hint Function 
    function hint(){
        if(prevInputId && !document.getElementById(prevInputId).classList.contains('done')){
            const input = document.getElementById(prevInputId)
            const hintsPlace = document.querySelector('.hints-span')
            hintsCount = parseInt(hintsPlace.textContent);
            if(hintsCount>=1){
                input.classList.remove('wrong')
                input.textContent = solution[input.id[0]][input.id[1]]
                if(hintsCount===1)
                    hintsPlace.innerHTML= `<img src='https://www.pngkey.com/png/full/179-1792540_dior-white-transparent-play-button.png' alt=''/>`
                else
                    hintsPlace.textContent= hintsCount-1;
                input.classList.add('done')
                hintsCount--;
            }
        }
    }

    function newGame(){
        document.querySelector('.mistakes-span').textContent = '0'
        document.querySelector('.hints-span').textContent = '3'
        hintsCount = 3
        setRender(!reRender)
    }


    function optionClickedfunc(){
        const newLevel = document.getElementById('selectLevel').value;
        document.querySelector('.mistakes-span').textContent = '0'
        document.querySelector('.hints-span').textContent = '3'
        hintsCount = 3
        setLevel(newLevel)
    }



    return(
        <div className='container'>
            <div className="leave-layout">
                <div className="content">
                    <div className="close"><i className='fa fa-times'></i></div>
                    <p className="leave-txt">Are you sure you want to leave this game ?</p>
                    <button className='okayBtn'>Yes</button>
                    <button className="cancelBtn">Cancel</button>
                </div>
            </div>
            <div className='header-box'>
                <h2>SU<span>D</span>OKU</h2>
                <p className='newGame' onClick={newGame}>New Game</p>
            </div>
            <Link className='link' to="/"><i className="fas fa-home"></i></Link>
            <div className='game'>
                <SudokuGrid onClicking={focusInput}/>
                <Controlers reRendering={reRender} optionClicked={optionClickedfunc} level={level} onClicking={NumberClicked} hintFunction={hint}/>
            </div>
        </div>
    )
}

export default Maker;






// When CLicking On Home And New Game 
// Music
// Home Design 
// Solver 
// When You Win
// Pencil
// Stop Btn
// local storage and high score
// Make The Design Responsive
// The New Game Btn Doesn't reset the timer
