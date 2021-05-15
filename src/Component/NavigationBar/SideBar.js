import React, {useState} from "react";
import * as AiIcons from "react-icons/ai";
import './SideBar.css';
import LocationCard from "./LocationCardsList";
import {useSelector} from "react-redux";
import LocationCardsList from "./LocationCardsList";

export default function SideBar({open, onClick}) {
    const {data} = useSelector(state => state.getDatas.datas);
    const [keyword, setKeyword] = useState('');

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
                        onChange={e => setKeyword(e.target.value)}
                    />

                    <div className='divider'/>

                    <LocationCardsList
                        data={data}
                    />

                </div>
            </div>
        </div>
    )
}
