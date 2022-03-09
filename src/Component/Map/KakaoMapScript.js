import GetCurrentLocation from "./GetCurrentLocation";
import loadMultiMarker from "./loadMultiMarker";
import React from 'react';
const { kakao } = window;

export default function KakaoMapScript(data, text) {

    const container = document.getElementById('myMap');

    while (container.hasChildNodes()) {

        container.removeChild(container.firstChild);
    }
    const options = {
        center: new kakao.maps.LatLng(data[0] === undefined ? 33.450701 : data[0].latitude, data[0] === undefined ? 126.570667 : data[0].longitude),
        level: text === "" ? 3 : 7
    };
    const map = new kakao.maps.Map(container, options);

    if (data[0] === undefined)
        alert('검색결과가 없습니다.')

    GetCurrentLocation(map, text);
    if (data !== null && data.length > 0) {
        loadMultiMarker(map, data);
    }
}
