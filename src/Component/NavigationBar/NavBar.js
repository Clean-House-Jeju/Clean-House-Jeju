import React, {useState} from 'react';
import './NavBar.css';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import SideBar from "./SideBar";

export default function NavBar() {
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
}
