import React from "react";

export default function LocationCard({data}) {
    return (
        <div className='location-card-container'>
            <h1>{data.location}</h1>
        </div>
    );
}
