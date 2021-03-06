import React from 'react';
import {recycleData} from "../../../../lib/showDataByDate";
import DayInfoCard from "./DayInfoCard";
import './DayInfoContainer.css';
const DayInfoContainer = React.memo(() => {

    return (
        <div className='day-info-container'>
            {
                recycleData.map((data, i) => <DayInfoCard key={i} name={data.name} day={data.day} type={data.type} img={data.img}/>)
            }
        </div>
    );
})

export default DayInfoContainer;
