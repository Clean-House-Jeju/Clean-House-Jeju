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
        <div className='menu-container'>
            <div className='search-box'>
                <FaIcons.FaBars onClick={onClick}/>
                <form>
                    <input
                        type="text"
                        className='input-texts'
                    />
                </form>
            </div>
            <div className='content-box'>
                <LocationCardList data={filterKeyword(data, text)}/>
            </div>
            <SideBar open={open} onClick={onClick}/>
        </div>
    );
})

export default NavBar
