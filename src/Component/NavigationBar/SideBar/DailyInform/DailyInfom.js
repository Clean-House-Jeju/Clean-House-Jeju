import React from 'react';
import './DailyInform.css';
import Logo from '../../../../lib/img/recycling-svgrepo-com.svg';
import {filterByDate} from "../../../../lib/showDataByDate";

export default function DailyInform() {

    const recycleType = filterByDate();

    return (
        <div className='daily-inform-container'>
            <div className='daily-inform-header'>
                금일 배출 항목은 ❓
            </div>
            <div className='daily-inform-body'>
                <img src={Logo} alt=""/>
                <div className='daily-inform-div-line'/>
                <div className='daily-inform-list'>{recycleType[0].type}</div>
            </div>
        </div>
    );
}
