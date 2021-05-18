import React from 'react';
import './LocationCardsList.css';
import LocationCard from "./LocationCard";

const LocationCardList = React.memo(({data}) => {

    return (
        <div className='card-list'>
            {
                data.map((d, i) => <LocationCard key={i} data={d}/>)
            }
        </div>
    );
})

export default LocationCardList
