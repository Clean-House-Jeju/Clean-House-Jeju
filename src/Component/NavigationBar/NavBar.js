import React, {useState} from 'react';
import './NavBar.css';
import * as FaIcons from 'react-icons/fa';
import SideBar from "./SideBar";
import LocationCardList from "./LocationCardsList";
import {useSelector} from "react-redux";
import filterKeyword from "../Map/filterKeyword";

const NavBar = React.memo(() => {
    const {data} = useSelector(state => state.getDatas.datas);
    const {text} = useSelector(state => state.keyword);
    const [open, setOpen] = useState(false);
    const onClick = () => setOpen(!open);
    return (
        <div className='wrapper'>
            <div className='menu-container'>
                <FaIcons.FaBars  onClick={onClick}/>
                <div className='div-line'></div>
                <form className='search-form'>
                    <input
                        type="text"
                        className='keyword-input'
                        placeholder='키워드를 입력해주세요'
                    />
                </form>

                <SideBar open={open} onClick={onClick}/>
            </div>

            <div className='content-wrapper'>


            </div>
        </div>
    );
})

export default NavBar
