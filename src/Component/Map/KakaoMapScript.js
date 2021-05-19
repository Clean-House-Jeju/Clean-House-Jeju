import GetCurrentLocation from "./GetCurrentLocation";
import loadMultiMarker from "./loadMultiMarker";
import React from 'react';
const { kakao } = window;

export default function KakaoMapScript(data) {

    const container = document.getElementById('myMap');
    while (container.hasChildNodes()) {
        container.removeChild(container.firstChild);
    }
    const options = {
        center: new kakao.maps.LatLng(33.450701, 126.570667),
        level: 3
    };
    const map = new kakao.maps.Map(container, options);

    // customoverlay(map, data);
    GetCurrentLocation(map);
    if (data !== null && data.length > 0) {
        loadMultiMarker(map, data);
    }

}
