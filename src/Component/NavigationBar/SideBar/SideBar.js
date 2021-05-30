import React from "react";
import * as AiIcons from "react-icons/ai";
import './SideBar.css';
import DailyInfom from "./DailyInform/DailyInfom";
import WeeklyInfom from "./WeeklyInform/WeeklyInfom";

const SideBar = React.memo(({open, onClick}) => {


    return (
        <div className={open ? 'nav-menu active' : 'nav-menu'}>

            <div className='nav-menu-items'>
                <div className='nav-toggle'>
                    <AiIcons.AiOutlineClose className='close-btn' onClick={onClick} />
                </div>
                <DailyInfom/>
                <WeeklyInfom/>

            </div>
        </div>
    )
})

export default SideBar;
