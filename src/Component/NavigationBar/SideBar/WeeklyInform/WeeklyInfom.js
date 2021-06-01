import React from 'react';
import './WeeklyInform.css';
import DayInfoCard from "./DayInfoCard";
import {recycleData} from "../../../../lib/showDataByDate";

export default function WeeklyInform() {
    return (
        <div className='weekly-inform-container'>
            {
                recycleData.map(data => <DayInfoCard day={data.day} type={data.type} color={data.color}/>)
            }

            <ul className=''>

            </ul>
        </div>
    );
}
