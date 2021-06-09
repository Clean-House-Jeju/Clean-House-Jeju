import React from 'react';
import './Loading.css';
import Logo from '../../lib/img/recycling-svgrepo-com.svg'
import {filterByDate} from "../../lib/showDataByDate";

export default function Loading() {

    const recycleType = filterByDate();

    return (
        <div className='loading-container'>
            <img className='logo' src={Logo} alt=""/>
            <div className='card'>
                <div className='header'>
                    금일 배출 항목은 ❓
                </div>
                <div className='icon-area'>
                    <img src={recycleType[0].img} alt=""/>
                </div>
                <div className='text-area'>
                    {recycleType[0].type}
                </div>
            </div>
            <span className='spin'/>
        </div>
    );
}
