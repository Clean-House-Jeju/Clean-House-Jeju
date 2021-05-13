import React, {useState} from 'react';
import './NavBar.css';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';

export default function NavBar() {
    const [open, setOpen] = useState(false);
    const onClick = () => setOpen(!open);

    return (
        <div className='NavBar'>

            <div className='menu-bars'>
                <FaIcons.FaBars onClick={onClick}/>
            </div>

            <nav className={open ? 'nav-menu active': 'nav-menu'}>
                <ul className='nav-menu-items'>
                    <li className='navbar-toggle'>
                        <AiIcons.AiOutlineClose className='close-btn' onClick={onClick} />
                    </li>
                </ul>
            </nav>
        </div>
    );
}
