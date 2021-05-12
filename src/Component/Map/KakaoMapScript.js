import GetCurrentLocation from "./GetCurrentLocation";
import loadMultiMarker from "./loadMultiMarker";
const { kakao } = window;

export default function KakaoMapScript(data) {

    const container = document.getElementById('myMap');
    const options = {
        center: new kakao.maps.LatLng(33.450701, 126.570667),
        level: 3
    };
    const map = new kakao.maps.Map(container, options);

    GetCurrentLocation(map);
    loadMultiMarker(map, data);

}
