
import React, { useState } from 'react'
import SudokuGrid from '../components/SudokuGrid';
import Controlers from '../components/Controlers';
import './Maker.css'


export function Maker(){
    // Variables
    let hintsCount = 300,prevInputId,newGameBool = false ,isCompletedBool = true , mistakes = 0 , totalTime , resetTimerBool = false;
    const [level , setLevel] = useState('easy');
    let showTimer = true , showHighlights = true , showMistakes = true , showIndicators = true;
    const [newGameClicked , setNewGameClicked] = useState(false)
    // Fetching The Sudoku 
    React.useEffect(()=>{
        console.log(level);
        fetch(`https://sugoku.herokuapp.com/board?difficulty=${level}`)
        .then(response=> response.json())
        .then(data => displaySudoku(data))
        .catch(error => console.error(error))
        window.addEventListener('keydown' , keyPressed)       // When You Click On A Number
        window.addEventListener('click', function(e){         // Removing The Focus Effect When You Click Outside The Grid
            if (!document.querySelector('.grid').contains(e.target) && prevInputId && !document.querySelector('.controlers-container').contains(e.target)){
                document.getElementById(`${prevInputId}`).classList.remove('focus')
                highLight('')
                prevInputId = null
            }
          });

        return () => {
            window.removeEventListener('keydown' , keyPressed)
        };

    })


    // Adding Focus Class On The Selected Input 
    function focusInput(e){
        if(prevInputId){
            document.getElementById(`${prevInputId}`).classList.remove('focus')
        }
        document.getElementById(`${e.target.id}`).classList.add('focus')
        prevInputId = e.target.id;
        highLight(document.getElementById(`${prevInputId}`).textContent)
    }

    // Gettting The Typing Number And Displaying It On The Screen
    function NumberClicked(e){
        if(prevInputId){
            const input = document.getElementById(`${prevInputId}`)
            if(!input.classList.contains('done')){
                input.textContent = e.target.id;
                rightOrWrong(input)
            }
        }else{
            highLight(e.target.id)
        }
    }
    

    // Delete Value 
    function deleteNumber(){
        const input = document.getElementById(`${prevInputId}`)
        if(!input.classList.contains('done')){


            input.classList.remove('wrong')
            input.classList.remove('right')
            input.classList.remove('blueBG')
            input.textContent = ''
            highLight(input.textContent)
            modifyNumArray()

            const spansContainer = document.getElementById(`spans${prevInputId}`)
            spansContainer.classList.remove('disappear')
            for(let i=0; i<9 ;i++){
                spansContainer.children[i].classList.add('disappear')
            }
        }
    }

    // Getting The Number From The Keyboard And Displaying It 
    function keyPressed(e){
        const number = e.key
        if(prevInputId){
            const input = document.getElementById(`${prevInputId}`)
            const pencil = document.querySelector('.edit')
            
            if(pencil.classList.contains('hold') || pencil.children[0].classList.contains('hold')){
                if(!input.classList.contains('wrong')&& !input.classList.contains('right')&&!input.classList.contains('done')){
                    const span = input.parentElement.children[1].children[number-1]
                    span.classList.toggle('disappear')
                }
            }else{
               
                if(prevInputId && e.keyCode <= 57 && e.keyCode>=49 && !input.classList.contains('done') && input.textContent!==number){
                    const numberLeft = parseInt(document.getElementById(`${e.key}`).children[0].textContent)
                    if(numberLeft!== 0 )
                    {
                        input.textContent = number;
                        rightOrWrong(input)
                    }
                }else if(prevInputId && e.keyCode == '8'){
                    deleteNumber()
                }
            }
        }else{
            highLight(e.key)
        }
    }

    // Displaying The Sudoku On The Grid 
    function displaySudoku(data){
        solve(data)
        const board = data.board;
        for(let i=0; i<board.length; i++){
            for(let n=0; n<board[i].length; n++){
                const input = document.getElementById(`${i}${n}`);
                const spansContainer = input.parentElement.children[1]
                input.classList.remove('blueBG')
                for(let s=0; s<9; s++){
                    spansContainer.children[s].classList.add('disappear')
                    spansContainer.children[s].classList.remove('blue')
                }
                if(board[i][n]!='0'){
                    input.textContent = board[i][n];
                    input.classList.add('done');
                    document.getElementById(`spans${i}${n}`).classList.add('disappear')
                    modifyNumArray()
                }else{
                    input.textContent = '';
                    input.classList.remove('done')
                    document.getElementById(`spans${i}${n}`).classList.remove('disappear')
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
        if(input.textContent == solution[input.id[0]][input.id[1]]){
            input.classList.remove('wrong')
            
            if(showMistakes)
                input.classList.add('right')

        }else{
            mistakes++
            document.querySelector('.mistakes-span').textContent = mistakes;
            input.classList.remove('right')
            if(showMistakes)
                input.classList.add('wrong')
            
            
        }
        isCompleted()
        modifyNumArray()
        highLight(input.textContent)
        document.getElementById(`spans${prevInputId}`).classList.add('disappear')
    }

    // Hint Function 
    function hint(){
        if(prevInputId && !document.getElementById(prevInputId).classList.contains('done') && !document.getElementById(prevInputId).classList.contains('right')){
            const input = document.getElementById(prevInputId)
            const hintsPlace = document.querySelector('.hints-span')
            if(hintsCount>=1){
                input.classList.remove('wrong')
                input.textContent = solution[input.id[0]][input.id[1]]
                if(hintsCount===1)
                    hintsPlace.innerHTML= `<img src='https://www.pngkey.com/png/full/179-1792540_dior-white-transparent-play-button.png' alt=''/>`
                else
                    hintsPlace.textContent= hintsCount-1;
                input.classList.add('done')
                document.getElementById(`spans${prevInputId}`).classList.add('disappear')
                isCompleted()
                modifyNumArray()
                hintsCount--;
            }
        }
    }

    function resetHintsAndMistakes(){
        mistakes = 0;
        hintsCount = 3
        document.querySelector('.mistakes-span').textContent = mistakes;
        document.querySelector('.hints-span').textContent = '3'
    }


    // Changing The Grid Shape And The Icon In The Upper Left Corner
    function pause(){
        const I = document.querySelector('.pauseI')
        const state = I.classList;
        let theClass = state[2]==='fa-play'? 'fa-pause':'fa-play';
        let title = state[2]==='fa-play'? 'Pause':'Resume';
        I.classList = `pauseI fa ${theClass}`;
        I.parentElement.title = title;
        document.querySelector('.pause-layout').classList.toggle('show')

    }
    
    // When You Click On The Okay Btn
    function changeLevel(){
        resetTimerBool = true;
        document.querySelector('.leave-layout').style.display="none"
        resetHintsAndMistakes()
        const newLevel = document.getElementById('selectLevel').value;
        if(document.querySelector('.pauseI').classList.contains('fa-play')){
            pause()
        }
        setLevel(newLevel)
        if(newGameBool){
            newGameBool=false;
            setNewGameClicked(!newGameClicked)
        }

    }
    // When You Click On Cancel Btn
    function cancelLeaving(){
        resetSelectedOption()
        document.querySelector('.leave-layout').style.display="none"
    }

    function resetSelectedOption(){
        const options = document.querySelectorAll('option')
        options.forEach(option=>{
            if(option.value==level){
                option.selected=true;
            }else{
                option.selected=false;
            }
        })
    }
    // on clicking on new game in the upper right corner
    function newGame(){
        document.querySelector('.leave-layout').style.display="flex"
        
        newGameBool=true;
    }

    // Checking if the Grid Is Completed
    function isCompleted(){
        const inputs = document.querySelectorAll('.square')
        isCompletedBool = true;
        inputs.forEach(input=>{
            if(!input.children[0].classList.contains('done') && !input.children[0].classList.contains('right')){
                isCompletedBool=false;
            }
        })
        if(isCompletedBool){
            document.querySelector('.winLayout').classList.add('show')
        }
    }
    // when the grid is completed and you Clicked on play again
    function youWon(){
        totalTime = document.querySelector('.timer').textContent
        console.log(totalTime);
        document.querySelector('.winLayout').classList.remove('show')
        newGameBool=true;
        changeLevel()
    }
    // Stoping The Timer 
    function manageTimer(){
        const winLayout = document.querySelector('.winLayout').classList.contains('show')
        const pauseLayout = document.querySelector('.pause-layout').classList.contains('show')
        const leaveLayout = document.querySelector('.leave-layout').style.display;
        if(winLayout||pauseLayout||leaveLayout==='flex'){
            
            return 'STOP'
        }else if(!showTimer){
            return 'HIDE'
        }else if(showTimer){
            return 'CONTINUE'
        }
        else{
            return 'CONTINUE'
        }
    }
    function modifyNumArray(){
        let numArray = [0,0,0,0,0,0,0,0,0]
        const inputs = document.querySelectorAll('.square')
        const spans = document.querySelectorAll('.absolute-span')
        inputs.forEach(input=>{
            let num , i=0
            if(input.children[0].textContent){
                num = parseInt(input.children[0].textContent)
                numArray[num-1]++
                
                spans.forEach(span=>{
                    span.textContent = 9-numArray[i]
                    i++
                    if(span.textContent == '0'){
                        span.parentElement.disabled = true;
                        span.parentElement.classList.add('disabled') 
                        span.classList.add('disappear')
                    }else{
                        span.parentElement.disabled = false;
                        span.parentElement.classList.remove('disabled') 
                        span.classList.remove('disappear')
                    }
                })
            }
        })
    }

    function comments(e){
        if(prevInputId){
            const idNumber = e.target.id;
            const input= document.getElementById(`${prevInputId}`);
            if(!input.classList.contains('wrong')&& !input.classList.contains('right')&&!input.classList.contains('done')){
                const span = input.parentElement.children[1].children[idNumber-1]
                span.classList.toggle('disappear')
            }
        }
    }

    function highLight(number){
        if(showHighlights){
            const filledinputs = document.querySelectorAll('.done ,.right')
            const unFilled = document.querySelectorAll('.blueBG');
            const spans = document.querySelectorAll(`#num${number}`)
            const unUsedSpans = document.querySelectorAll('.blue')
            if(unFilled){
                unFilled.forEach(item=> item.classList.remove('blueBG'))
            }
            filledinputs.forEach(filledInput=>{
                if(filledInput.textContent == number){
                    filledInput.classList.add('blueBG')
                }
            })
            spans.forEach(span=>{
                if(!span.classList.contains('disappear')){
                    span.classList.add('blue')
                }
            })
            unUsedSpans.forEach(unUsedSpan=> unUsedSpan.classList.remove('blue'))
        }
    }

    function onOff(e){
        if(e.target.classList.contains('circle')){
            e.target.classList.toggle('on')
        }else{
            e.target.children[0].classList.toggle('on')
        }   
    }

    function openCloseSettings(){
        document.querySelector('.settings-layout').classList.toggle('show')
        document.getElementById('highlights-btn').classList = `circle ${showHighlights?'on': ''}`
        document.getElementById('mistakes-btn').classList = `circle ${showMistakes?'on': ''}`
        document.getElementById('indicator-btn').classList = `circle ${showIndicators?'on': ''}`
        document.getElementById('timer-btn').classList = `circle ${showTimer?'on': ''}`
    }

    function resetSettings(){
        const circles = document.querySelectorAll('.circle');
        circles.forEach(circle=> circle.classList.add('on'))
    }

    function saveSettings(){
        showHighlights = document.getElementById('highlights-btn').classList.contains('on');
        showMistakes = document.getElementById('mistakes-btn').classList.contains('on')
        showIndicators = document.getElementById('indicator-btn').classList.contains('on')
        showTimer = document.getElementById('timer-btn').classList.contains('on')

        if(!showHighlights){
            const highLightedComments = document.querySelectorAll('.blue');
            highLightedComments.forEach(highlighedItem => highlighedItem.classList.remove('blue'))
            const highLighted = document.querySelectorAll('.blueBG');
            highLighted.forEach(highlighedItem => highlighedItem.classList.remove('blueBG'))
        }
        if(!showMistakes){
            const rights = document.querySelectorAll('.right');
            const wrongs = document.querySelectorAll('.wrong');
            rights.forEach(right=> right.classList.replace('right' , 'wasRight'))
            wrongs.forEach(wrong=> wrong.classList.replace('wrong' ,'wasWrong'))
        }else{
            const rights = document.querySelectorAll('.wasRight');
            const wrongs = document.querySelectorAll('.wasWrong');
            rights.forEach(right=> right.classList.replace('wasRight' , 'right'))
            wrongs.forEach(wrong=> wrong.classList.replace('wasWrong' , 'wrong'))
        }
        if(!showIndicators){
            const indicators = document.querySelectorAll('.absolute-span')
            indicators.forEach(indicator=> indicator.style.display = 'none')
        }else{
            const indicators = document.querySelectorAll('.absolute-span')
            indicators.forEach(indicator=> indicator.style.display = 'block')
        }
        manageTimer()
        openCloseSettings()
    }


    return(
        <div className='container'>
            <div className="pause" title='Pause' onClick={pause}><i className="pauseI fa fa-pause"></i></div>
            <div className="gearIcon" title='Settings' onClick={openCloseSettings}><i className="fa fa-cog"></i></div>
            <div className="winLayout">
                <div className="win-content">
                    <h1>Excellent! <i className="fa fa-star"></i></h1>
                    <p className="total-time">{totalTime}</p>
                    <button onClick={youWon} className="playAgain">Play Again</button>
                </div>
            </div>
            <div className="settings-layout">
                <div className="settings-content">
                    <div onClick={openCloseSettings} className="close"><i className='fa fa-times'></i></div>
                    <h3 className="main-title">Settings</h3>
                    <div className="item">
                        <p className="title">Show Highlights</p>
                        <div onClick={onOff} className="adjust" ><span id='highlights-btn' className="circle on"></span></div>
                    </div>
                    <div className="item">
                        <p className="title">Show Right Or Wrong</p>
                        <div onClick={onOff} className="adjust"><span id='mistakes-btn' className="circle on"></span></div>
                    </div>
                    <div className="item">
                        <p className="title">Number Indication</p>
                        <div onClick={onOff} className="adjust"><span id='indicator-btn' className="circle on"></span></div>
                    </div>
                    <div className="item">
                        <p className="title">Show Timer</p>
                        <div onClick={onOff} className="adjust"><span id='timer-btn' className="circle on"></span></div>
                    </div>
                    <div className="btns">
                        <p onClick={resetSettings} className="reset">reset settings</p>
                        <button onClick={saveSettings} className="save">Save</button>
                        <button onClick={openCloseSettings} className="closeSetting">Cancel</button>
                    </div>
                </div>
            </div>
            <div className="leave-layout">
                <div className="content">
                    <div onClick={cancelLeaving} className="close"><i className='fa fa-times'></i></div>
                    <p className="leave-txt">Are you sure you want to leave this game ?</p>
                    <button onClick={changeLevel} className='okayBtn'>Yes</button>
                    <button onClick={cancelLeaving} className="cancelBtn">Cancel</button>
                </div>
            </div>
            <div className='header-box'>
                <h2>SU<span>D</span>OKU</h2>
                <p className='newGame' onClick={newGame}>New Game</p>
            </div>
            <div className='game'>
                <SudokuGrid onClicking={focusInput}/>
                <Controlers commentsFunc = {comments} Timer={manageTimer} delete={deleteNumber}  level={level} onClicking={NumberClicked} hintFunction={hint}/>
            </div>
        </div>
    )
}

export default Maker;








// Make The Design Responsive
// reset the timer
// play some levels
// cursor
// highlighting the comments 
// you can't put a comment if the number is finished