import { useEffect , useState } from "react";
import React from 'react'

function Timer(props){
    const [minutes, setMinutes ] =  useState(0);
    const [seconds, setSeconds ] =  useState(0);

    useEffect(()=>{
        let myInterval = setInterval(() => {
            const status = props.timer()
            if(status === 'CONTINUE' || status === "HIDE"){
                document.querySelector('.timer').style.opacity = status==='CONTINUE' ? '1': '0'
                if (seconds < 59) {
                    setSeconds(seconds + 1);
                }
                if (seconds === 59) {
                    setMinutes(minutes + 1);
                    setSeconds(0);
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