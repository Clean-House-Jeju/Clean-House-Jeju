import React from "react";
import './LocationCard.css';

const LocationCard = React.memo(({data}) => {
    return (
        <div className='location-card-container'>
            <p>
                {data.location}
            </p>
        </div>
    );
});

export default LocationCard;
