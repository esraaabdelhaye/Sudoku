import React from "react";
import {useState , useEffect} from 'react'
import parse from "html-react-parser";
function Controlers(props){
    const [minutes, setMinutes ] =  useState(0);
    const [seconds, setSeconds ] =  useState(0);
    useEffect(()=>{

        let myInterval = setInterval(() => {
            if (seconds < 59) {
                setSeconds(seconds + 1);
            }
            if (seconds === 59) {
                setMinutes(minutes + 1);
                setSeconds(0);
            } 

            }, 1000)
            return ()=> {
                clearInterval(myInterval);
            };
    })
    let options='';
    const levels = ['easy' , 'medium' , 'hard' , "random"]
    levels.forEach(level=>{
        if(level!=props.level)
            options+=`<option value=${level}>${level}</option>`
        else
            options+=`<option selected value=${level}>${level}</option>`
    })

    function clickingOption(){
        if(document.getElementById('selectLevel').value!==props.level){
            setMinutes(0)
            setSeconds(0)
            props.optionClicked()
        }
    }

    return(
        <div className="controlers-container">
            <div className="select">
                <label htmlFor="selectLevel">Diffeculty: </label>
                <div className="selectCont">
                    <select name="selectLevel" id="selectLevel" onClick={clickingOption}>
                        {parse(options)}
                    </select>
                </div>
            </div>
            <p className='timer'>{minutes < 10? `0${minutes}`: {minutes}}:{seconds < 10 ?  `0${seconds}` : seconds}</p>
            <div className='modify'>
                <button title="Delete" onClick={props.onClicking} className='delete' id=""><i className="fa-solid fa-eraser"></i></button>
                <button title="Hint" onClick={props.hintFunction} className="hint"><i className="fas fa-lightbulb"></i><span className='hints-span'>3</span></button>
                <button title="Pencil" className="edit"><i className="fa fa-pencil"></i></button>
            </div>
            <div className="num-btns">
                <button className="num-btn" onClick={props.onClicking} id="1">1</button>
                <button className="num-btn" onClick={props.onClicking} id="2">2</button>
                <button className="num-btn" onClick={props.onClicking} id="3">3</button>
                <button className="num-btn" onClick={props.onClicking} id="4">4</button>
                <button className="num-btn" onClick={props.onClicking} id="5">5</button>
                <button className="num-btn" onClick={props.onClicking} id="6">6</button>
                <button className="num-btn" onClick={props.onClicking} id="7">7</button>
                <button className="num-btn" onClick={props.onClicking} id="8">8</button>
                <button className="num-btn" onClick={props.onClicking} id="9">9</button>
            </div>  
            <div className="extra-info">
                <p className='mistakes'>Mistakes : <span className='mistakes-span'>0</span></p>
            </div>
        </div>
    )
}

export default Controlers;