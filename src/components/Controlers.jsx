import React, { useRef } from "react";
import {useState , useEffect} from 'react'
import parse from "html-react-parser";
import Timer from "./Timer";
import { click } from "@testing-library/user-event/dist/click";
function Controlers(props){

    const [comments , setComments] = useState(false)
    let options= '';
    const levels = ['easy' , 'medium' , 'hard' , "random"]
    

    levels.forEach(level=>{
        if(level!==props.level)
            options+=`<option value=${level}>${level}</option>`
        else
            options+=`<option selected value=${level}>${level}</option>`
    })    
    function clickingOption(){
        if(document.getElementById('selectLevel').value!==props.level){
            document.querySelector('.leave-layout').style.display="flex"
        }
    }
    function changeCommentValue(e){
        setComments(!comments)
        const clicked = e.target;
        if(clicked.tagName === 'BUTTON'){
            clicked.classList.toggle('hold');
        }else{
            clicked.parentElement.classList.toggle('hold');   
        }
        hideShowIndicators()
    }
    function hideShowIndicators(){
        const indicators = document.querySelectorAll('.absolute-span')
        indicators.forEach(indicator=> {
            if(!comments)
                indicator.classList.add('disappear')
            else
                indicator.classList.remove('disappear')
        })
    }

    return(
        <div className="controlers-container">
            <div className="select">
                <label htmlFor="selectLevel">Diffeculty: </label>
                <div className="selectCont">
                    <select name="selectLevel" id="selectLevel" onChange={clickingOption}>
                        {parse(options)}
                    </select>
                </div>
            </div>
            <Timer level={props.level} timer={props.Timer}/>
            <div className='modify'>
                <button title="Delete" onClick={props.delete} className='delete'><i className="fa-solid fa-eraser"></i></button>
                <button title="Hint" onClick={props.hintFunction} className="hint"><i className="fas fa-lightbulb"></i><span className='hints-span'>3</span></button>
                <button title="Pencil" onClick={changeCommentValue} className="edit"><i className="fa fa-pencil"></i></button>
            </div>
            <div className="num-btns">
                <button className="num-btn" onClick={comments? props.commentsFunc: props.onClicking} id="1">1<span className='absolute-span hints-span'></span></button>
                <button className="num-btn" onClick={comments? props.commentsFunc: props.onClicking} id="2">2<span className='absolute-span hints-span'></span></button>
                <button className="num-btn" onClick={comments? props.commentsFunc: props.onClicking} id="3">3<span className='absolute-span hints-span'></span></button>
                <button className="num-btn" onClick={comments? props.commentsFunc: props.onClicking} id="4">4<span className='absolute-span hints-span'></span></button>
                <button className="num-btn" onClick={comments? props.commentsFunc: props.onClicking} id="5">5<span className='absolute-span hints-span'></span></button>
                <button className="num-btn" onClick={comments? props.commentsFunc: props.onClicking} id="6">6<span className='absolute-span hints-span'></span></button>
                <button className="num-btn" onClick={comments? props.commentsFunc: props.onClicking} id="7">7<span className='absolute-span hints-span'></span></button>
                <button className="num-btn" onClick={comments? props.commentsFunc: props.onClicking} id="8">8<span className='absolute-span hints-span'></span></button>
                <button className="num-btn" onClick={comments? props.commentsFunc: props.onClicking} id="9">9<span className='absolute-span hints-span'></span></button>
            </div>  
            <div className="extra-info">
                <p className='mistakes'>Mistakes : <span className='mistakes-span'>0</span></p>
            </div>
        </div>
    )
}

export default Controlers;


// Tommorow
// make the timer in a separate component which returns p.timer only 
// work on the pencil 