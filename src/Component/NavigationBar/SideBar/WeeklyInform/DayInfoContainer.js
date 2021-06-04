import React from 'react';
import {recycleData} from "../../../../lib/showDataByDate";
import DayInfoCard from "./DayInfoCard";
import './DayInfoContainer.css';
export default function DayInfoContainer() {
    return (
        <div className='day-info-container'>
            {
                recycleData.map(data => <DayInfoCard day={data.day} type={data.type} img={data.img}/>)
            }
        </div>
    );
}
