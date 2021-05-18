import React, {useState} from 'react';
import './NavBar.css';
import * as FaIcons from 'react-icons/fa';
import SideBar from "./SideBar";

const NavBar = React.memo(() => {
    const [open, setOpen] = useState(false);
    const onClick = () => setOpen(!open);

    return (
        <div className='NavBar'>

            <div className='menu-bars'>
                <FaIcons.FaBars onClick={onClick}/>
            </div>

            <SideBar open={open} onClick={onClick}/>
        </div>
    );
})

export default NavBar
