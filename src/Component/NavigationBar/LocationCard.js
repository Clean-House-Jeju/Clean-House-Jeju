import React from "react";
import './LocationCard.css';

export default function LocationCard({data}) {
    return (
        <div className='location-card-container'>
            <p>
                {data.location}
            </p>
        </div>
    );
}
