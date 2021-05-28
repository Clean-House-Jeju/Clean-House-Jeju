import GetCurrentLocation from "./GetCurrentLocation";
import loadMultiMarker from "./loadMultiMarker";
import { setKeyword } from "../../Modules/keyword";
import React from 'react';
const { kakao } = window;

export default function KakaoMapScript(data, text) {

    const container = document.getElementById('myMap');

    while (container.hasChildNodes()) {

        container.removeChild(container.firstChild);
    }
    const options = {
        center: new kakao.maps.LatLng(data[0].latitude, data[0].longitude),
        level: text === "" ? 3 : 7
    };
    const map = new kakao.maps.Map(container, options);


    GetCurrentLocation(map, text);
    if (data !== null && data.length > 0) {
        loadMultiMarker(map, data);
    }

}
