import React from "react";
import * as AiIcons from "react-icons/ai";
import './SideBar.css';

export default function SideBar({open, onClick}) {
    return (
        <div className={open ? 'nav-menu active': 'nav-menu'}>
            <div className='nav-menu-items'>
                <div className='navbar-toggle'>
                    <AiIcons.AiOutlineClose className='close-btn' onClick={onClick} />
                </div>
                <div className='content-box'>
                    <input
                        className='input-text'
                        placeholder='키워드를 입력 해주세요'
                        type="text"
                    />

                </div>
            </div>
        </div>
    )
}
