import React, {useState} from 'react';
import './NavBar.css';
import * as FaIcons from 'react-icons/fa';
import SideBar from './SideBar/SideBar';
import {useDispatch} from "react-redux";
import ContentContainer from "./ContentContainer";
import {setKeyword} from "../../Modules/keyword";
import {initCardData} from "../../Modules/cardData";

const NavBar = React.memo(() => {
    const [input, setInput] = useState('');

    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);

    const handleKeyword = (e) => {
        e.preventDefault();
        dispatch(setKeyword(input));
        dispatch(initCardData());
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
                    />
                </form>

                <SideBar open={open} onClick={onClick}/>
            </div>

            <div id='content-wrapper'>
                <ContentContainer />
            </div>
        </div>
    );
})

export default NavBar
