import React from 'react';
import './LocationCardsList.css';
import LocationCard from "./LocationCard";

export default function LocationCardList({data}) {

    return (
        <div className='card-list'>
            {
                data.map((d, i) => <LocationCard key={i} data={d}/>)
            }
        </div>
    );
}
