import React, { useState } from "react";
import * as AiIcons from "react-icons/ai";
import './SideBar.css';

import {useDispatch, useSelector} from "react-redux";
import LocationCardsList from "./LocationCardsList";
import {setKeyword} from "../../Modules/keyword";

const SideBar = React.memo(({open, onClick}) => {
    const [input, setInput] = useState('');
    const {data} = useSelector(state => state.getDatas.datas);
    const {text} = useSelector(state => state.keyword);
    const dispatch = useDispatch();

    const handleKeyword = (e) => {
        e.preventDefault();
        dispatch(setKeyword(input));
    }

    const onChange = (e) => {
       setInput(e.target.value);
       console.log(input);
    }

    return (
        <div className={open ? 'nav-menu active' : 'nav-menu'}>
            <div className='nav-menu-items'>
                <div className='navbar-toggle'>
                    <AiIcons.AiOutlineClose className='close-btn' onClick={onClick} />
                </div>
                <div className='content-box'>
                    <form onSubmit={e => handleKeyword(e)}>
                        <input
                            className='input-text'
                            placeholder='키워드를 입력 해주세요'
                            type="text"
                            onChange={e => onChange(e)}
                        />
                    </form>

                    <div className='divider' />

                    <LocationCardsList
                        data={data.filter(d => d.location.toLowerCase().includes(text))}
                    />

                </div>
            </div>
        </div>
    )
})

export default SideBar;
