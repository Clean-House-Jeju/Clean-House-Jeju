import React from 'react';
const { kakao } = window;

export default function GetCurrentLocation(map, text) {
    // HTML5의 geolocation으로 사용할 수 있는지 확인합니다
    if (navigator.geolocation) {

        // GeoLocation을 이용해서 접속 위치를 얻어옵니다


        navigator.geolocation.getCurrentPosition(function (position) {


            const lat = position.coords.latitude; // 위도
            const lon = position.coords.longitude; // 경도

            const locPosition = new kakao.maps.LatLng(lat, lon), // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
                message = '<div style=" padding-top: 5px; padding-left: 25px;  height: 25px; width:150px">📍 현재 위치  </div>'; // 인포윈도우에 표시될 내용입니다

            // 마커와 인포윈도우를 표시합니다
            displayMarker(locPosition, message);

        });

    } else { // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다

        const locPosition = new kakao.maps.LatLng(33.450701, 126.570667),
            message = '현재 위치를 가져 올 수가 없습니다.'

        displayMarker(locPosition, message);
    }

    // 지도에 마커와 인포윈도우를 표시하는 함수입니다
    function displayMarker(locPosition, message) {
        var imageSrc = "현재마커.svg"
        let imageSize = new kakao.maps.Size(34, 46);
        let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
        // 마커를 생성합니다
        const marker = new kakao.maps.Marker({
            map: map,
            zIndex: 8,
            image: markerImage,
            position: locPosition
        });

        const iwContent = message, // 인포윈도우에 표시할 내용
            iwRemoveable = true;

        // 인포윈도우를 생성합니다
        const infowindow = new kakao.maps.InfoWindow({
            content: iwContent,
            zIndex: 8,
            removable: iwRemoveable
        });

        if (text === "") {
            // 인포윈도우를 마커위에 표시합니다
            infowindow.open(map, marker);

            // 지도 중심좌표를 접속위치로 변경합니다
            map.setCenter(locPosition);
        }
    }
}
