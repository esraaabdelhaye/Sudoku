import {Link} from 'react-router-dom'


function Navbar(){
    return(
        <>
            <ul>
                <li>
                    Generate
                        <ul>
                            <li><Link to="/Maker"  state={{level:"easy"}}>Easy</Link></li>
                            <li><Link to="/Maker"  state={{level:"medium"}}>Medium</Link></li>
                            <li><Link to="/Maker"  state={{level:"hard"}}>Hard</Link></li>
                            <li><Link to="/Maker"  state={{level:"random"}}>Random</Link></li>
                        </ul>
                </li>
                <li><Link to='/Solver'>Solver</Link></li>
            </ul>
        </>
    )
}


export default Navbar;