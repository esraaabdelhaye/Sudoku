import React, { useEffect } from 'react'
import parse from "html-react-parser";
function SudokuGrid(props){
    let htmlCode='' , spans =''
    returnSpans()
 
    for(let i=0; i<9; i++){
        htmlCode+=`
        <div className="box">
            <div className="square"><span id='${i}0' className="value"></span><div id='spans${i}0' className="spans-container">${spans}</div></div>
            <div className="square"><span id='${i}1' className="value"></span><div id='spans${i}1' className="spans-container">${spans}</div></div>
            <div className="square"><span id='${i}2' className="value"></span><div id='spans${i}2' className="spans-container">${spans}</div></div>
            <div className="square"><span id='${i}3' className="value"></span><div id='spans${i}3' className="spans-container">${spans}</div></div>
            <div className="square"><span id='${i}4' className="value"></span><div id='spans${i}4' className="spans-container">${spans}</div></div>
            <div className="square"><span id='${i}5' className="value"></span><div id='spans${i}5' className="spans-container">${spans}</div></div>
            <div className="square"><span id='${i}6' className="value"></span><div id='spans${i}6' className="spans-container">${spans}</div></div>
            <div className="square"><span id='${i}7' className="value"></span><div id='spans${i}7' className="spans-container">${spans}</div></div>
            <div className="square"><span id='${i}8' className="value"></span><div id='spans${i}8' className="spans-container">${spans}</div></div>
        </div>
        `
    }

    function returnSpans(){
        for(let i=1; i<10; i++){
            spans+=`<span className="comment-span disappear" id=num${i}>${i}</span>`
        }
    }


 


    useEffect(()=>{

        const squares = document.querySelectorAll('.square');
        squares.forEach(square=>{
            square.addEventListener('click' , props.onClicking)
        })
    })

    return (
        <div className='grid'>
            <div className="pause-layout">
                <h1>SUDOKU PAUSED</h1>
            </div>
            {parse(htmlCode)}
        </div>
    )
}

export default SudokuGrid;