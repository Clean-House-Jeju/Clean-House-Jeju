import React, { useState } from "react";
import * as AiIcons from "react-icons/ai";
import './SideBar.css';
import DailyInfom from "./DailyInfom";

const SideBar = React.memo(({open, onClick}) => {


    return (
        <div className={open ? 'nav-menu active' : 'nav-menu'}>

            <div className='nav-menu-items'>
                <div className='nav-toggle'>
                    <AiIcons.AiOutlineClose className='close-btn' onClick={onClick} />
                </div>
                <DailyInfom/>


            </div>
        </div>
    )
})

export default SideBar;
