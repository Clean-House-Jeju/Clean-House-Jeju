import React, { useEffect } from 'react';
import KakaoMapScript from "./KakaoMapScript";
import './Map.css';

export default function Map() {

    useEffect(() => {
        KakaoMapScript();
    }, []);

    return (
        <div id='myMap'/>
    );
}

