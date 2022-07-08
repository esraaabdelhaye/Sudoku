import React, { useEffect } from 'react'
import parse from "html-react-parser";
function SudokuGrid(props){

    let htmlCode='';
    for(let i=0; i<9; i++){
        htmlCode+=`
        <div className="box">
            <div id='${i}0' className="square"></div>
            <div id='${i}1' className="square"></div>
            <div id='${i}2' className="square"></div>
            <div id='${i}3' className="square"></div>
            <div id='${i}4' className="square"></div>
            <div id='${i}5' className="square"></div>
            <div id='${i}6' className="square"></div>
            <div id='${i}7' className="square"></div>
            <div id='${i}8' className="square"></div>
        </div>
        `
    }

    useEffect(()=>{
        const squares = document.querySelectorAll('.square');
        squares.forEach(square=>{
            square.addEventListener('click' , props.onClicking)
        })
    })

    return (
        <div className='grid'>
            {parse(htmlCode)}
        </div>
    )
}

export default SudokuGrid;