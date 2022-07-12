import { useEffect , useState } from "react";
import React from 'react'

function Timer(props){
    const [minutes, setMinutes ] =  useState(0);
    const [seconds, setSeconds ] =  useState(0);
    let secs = 0 , mins = 0 , newLevel = ''
    let level = '';
    useEffect(()=>{
        const selectLevel = document.getElementById('selectLevel').value;
        let myInterval = setInterval(() => {
            secs = seconds
            mins = minutes;
            level = props.level;
            if(level!==newLevel && document.querySelector('.okayBtn').classList.contains('clicked')){
                document.querySelector('.okayBtn').classList.remove('clicked')
                secs = -1 
                mins = 0
            }

            const status = props.timer()
            if(status === 'CONTINUE' || status === "HIDE"){
                document.querySelector('.timer').style.opacity = status==='CONTINUE' ? '1': '0'
                if (secs < 60) {
                    secs++
                    setSeconds(secs); 
                    setMinutes(mins);  
                }
                if (secs === 60) {
                    mins++
                    secs = 0
                    setMinutes(mins);
                    setSeconds(secs);
                } 
            }
        }, 1000)
        return ()=> {
            clearInterval(myInterval);
        };
    })

    return(
        <p className='timer'>{minutes < 10? `0${minutes}`: minutes}:{seconds < 10 ?  `0${seconds}` : seconds}</p>
    )
}

export default Timer;