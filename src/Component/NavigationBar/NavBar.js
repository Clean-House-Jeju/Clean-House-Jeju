import React, {useState} from 'react';
import './NavBar.css';
import * as FaIcons from 'react-icons/fa';
import {GrPowerReset} from 'react-icons/gr';
import SideBar from './SideBar/SideBar';
import {useDispatch, useSelector} from "react-redux";
import ContentContainer from "./ContentContainer";
import {setKeyword} from "../../Modules/keyword";
import {initCardData} from "../../Modules/cardData";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import {closeToggle, openToggle} from "../../Modules/toggle";

const NavBar = React.memo(() => {
    const {isToggle} = useSelector(state => state.toggle);
    const [input, setInput] = useState('');
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);

    const onToggle = () => {
        if (isToggle) {
            dispatch(initCardData());
            dispatch(closeToggle());
        } else {
            dispatch(openToggle());
        }
    }

    const handleKeyword = (e) => {
        e.preventDefault();
        dispatch(setKeyword(input));
        dispatch(initCardData());
        dispatch(openToggle());
        setInput('');
    }

    const onReset = () => {
        dispatch(initCardData());
        dispatch(setKeyword(input));
        dispatch(closeToggle());
    }

    const onChange = (e) => {
        setInput(e.target.value);
    }

    const onClick = () => setOpen(!open);

    return (
        <div className='nav-wrapper'>
            <div className='menu-container'>
                <FaIcons.FaBars  onClick={onClick}/>
                <div className='div-line'/>
                <form
                    className='search-form'
                    onSubmit={e => handleKeyword(e)}
                >
                    <input
                        type="text"
                        className='keyword-input'
                        placeholder='키워드를 입력해주세요'
                        onChange={e => onChange(e)}
                        value={input}
                    />
                </form>
                <GrPowerReset onClick={onReset}/>
                <SideBar open={open} onClick={onClick}/>
            </div>

            <div id={isToggle? "content-wrapper": "content-wrapper content-wrapper-disabled"}>
                <ContentContainer/>
            </div>

            <div className={isToggle? 'content-fold': 'content-fold folded'}>
                {
                    isToggle
                        ? <IoIosArrowUp onClick={onToggle}/>
                        : <IoIosArrowDown onClick={onToggle}/>
                }
            </div>
        </div>
    );
})

export default NavBar
