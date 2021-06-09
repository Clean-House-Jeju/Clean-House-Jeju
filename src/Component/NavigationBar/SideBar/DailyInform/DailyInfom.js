import React from 'react';
import './DailyInform.css';
import {filterByDate} from "../../../../lib/showDataByDate";

const DailyInform = React.memo(() => {

    const recycleType = filterByDate();

    return (
        <div className='daily-inform-container'>
            <div className='daily-inform-header'>
                금일 배출 항목은 ❓
            </div>
            <div className='daily-inform-body'>
                <img src={recycleType[0].img} alt=""/>
                <div className='daily-inform-div-line'/>
                <div className='daily-inform-list'>{recycleType[0].type}</div>
            </div>
        </div>
    );
});

export default DailyInform;
