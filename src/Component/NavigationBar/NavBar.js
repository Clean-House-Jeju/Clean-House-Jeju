import React, {useState} from 'react';
import './NavBar.css';
import * as FaIcons from 'react-icons/fa';

export default function NavBar() {

    return (
        <div className='NavBar'>
            <FaIcons.FaBars/>
            <ul>
                <li>안녕</li>
            </ul>
        </div>
    );
}
