import React from "react";
import * as AiIcons from "react-icons/ai";
import './SideBar.css';

export default function SideBar({open, onClick}) {
    return (
        <div className={open ? 'nav-menu active': 'nav-menu'}>
            <ul className='nav-menu-items'>
                <li className='navbar-toggle'>
                    <AiIcons.AiOutlineClose className='close-btn' onClick={onClick} />
                </li>
            </ul>
        </div>
    )
}
