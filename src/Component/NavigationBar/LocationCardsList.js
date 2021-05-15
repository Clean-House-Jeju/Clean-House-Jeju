import React from 'react';
import './LocationCardsList.css';
import LocationCard from "./LocationCard";

export default function LocationCardList({data}) {

    return (
        <div className='card-list'>
            {
                data.map(d => <LocationCard data={d}/>)
            }
        </div>
    );
}
