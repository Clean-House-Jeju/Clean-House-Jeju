import React, {useState} from "react";
import * as AiIcons from "react-icons/ai";
import './SideBar.css';
import {useDispatch, useSelector} from "react-redux";
import LocationCardsList from "./LocationCardsList";
import KakaoMapScript from "../Map/KakaoMapScript";
import {setKeyword} from "../../Modules/keyword";

export default function SideBar({open, onClick}) {

    const {data} = useSelector(state => state.getDatas.datas);
    const {text} = useSelector(state => state.keyword);
    const dispatch = useDispatch();

    const handleKeyword = (text) => {
        dispatch(setKeyword(text));
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
                        data={data.filter(d => d.location.toLowerCase().includes(text))}
                    />

                </div>
            </div>
        </div>
    )
}
