import {Link , useLocation} from 'react-router-dom'



function Maker(){

    const info = useLocation()
    const data = info.state;

    return(
        <>
            <Link to="/">Home</Link>
            <h1>{data.level} Maker Page</h1>
        </>
    )
}

export default Maker;