import React, {useState} from "react";
import * as AiIcons from "react-icons/ai";
import './SideBar.css';
import {useSelector} from "react-redux";
import LocationCardsList from "./LocationCardsList";
import KakaoMapScript from "../Map/KakaoMapScript";

export default function SideBar({open, onClick}) {

    const {data} = useSelector(state => state.getDatas.datas);
    const [keyword, setKeyword] = useState('');

    const handleKeyword = (text) => {
        setKeyword(text);
    }

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
                        onChange={e => handleKeyword(e.target.value)}
                    />

                    <div className='divider'/>

                    <LocationCardsList
                        data={data.filter(d => d.location.toLowerCase().includes(keyword))}
                    />

                </div>
            </div>
        </div>
    )
}
