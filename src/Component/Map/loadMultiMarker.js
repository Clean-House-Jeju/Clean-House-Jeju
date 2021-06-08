import CleanOverlay from '../InformationCard/CleanOverlay';
import MarkerRunnig from '../InformationCard/MarkerRunnig';
import RecycleOverlay from '../InformationCard/RecycleOverlay';

const { kakao } = window;



export default function LoadMultiMarker(map, data) {
    console.log(data);

    var Cleanmarkers = [];
    var Recyclemarkers = [];
    var dataSerched;

    for (let i = 0; i < data.length; i++) {



        if (data[i].type == 'clean') {
            clean = true;
            recycle = false
            var imageSrc = MarkerRunnig(clean, recycle, data, i);
        }
        else if (data[i].type == 'recycle') {
            recycle = true;
            clean = false;
            var imageSrc = MarkerRunnig(clean, recycle, data, i);
        }
        // 마커 이미지의 이미지 크기 입니다
        let imageSize = new kakao.maps.Size(24, 35);

        // 마커 이미지를 생성합니다
        let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
        // 마커를 생성합니다

        if (data[i].type == 'clean') {
            var marker = new kakao.maps.Marker({
                map: map, // 마커를 표시할 지도
                position: new kakao.maps.LatLng(data[i].latitude, data[i].longitude), // 마커를 표시할 위치
                title: data[i].location, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
                image: markerImage,// 마커 이미지
                zIndex: 5,
                clickable: true
            });

            Cleanmarkers.push(marker);
        }
        else if (data[i].type == 'recycle') {
            var marker = new kakao.maps.Marker({
                map: map, // 마커를 표시할 지도
                position: new kakao.maps.LatLng(data[i].latitude, data[i].longitude), // 마커를 표시할 위치
                title: data[i].location, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
                image: markerImage,// 마커 이미지
                zIndex: 5,
                clickable: true
            });
            Recyclemarkers.push(marker);
        }





        var clean = CleanOverlay(data, i);
        var recycle = RecycleOverlay(data, i);

        if (data[i].type == 'clean') {
            var overlay = new kakao.maps.CustomOverlay({
                content: clean,
                zIndex: 8,
                map: map,
                position: marker.getPosition(),
                clickable: true
            });
        }
        else if (data[i].type == 'recycle') {
            var overlay = new kakao.maps.CustomOverlay({
                content: recycle,
                zIndex: 9,
                map: map,
                position: marker.getPosition(),
                clickable: true
            });
        }


        if (data[i].type == 'clean') {
            // 클린하우스 클러스터
            var Cleanclusterer = new kakao.maps.MarkerClusterer({
                map: map,
                gridSize: 100, // 마커들을 클러스터로 관리하고 표시할 지도 객체 
                averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정 
                minLevel: 5, // 클러스터 할 최소 지도 레벨 
                zIndex: 3,
                texts: " ",
                styles: [{
                    width: '53px', height: '52px',
                    background: 'url(Clean_house_active.svg) no-repeat'
                }]
            });
        }

        else if (data[i].type == 'recycle') {
            var Recycleclusterer = new kakao.maps.MarkerClusterer({
                map: map,
                gridSize: 150, // 마커들을 클러스터로 관리하고 표시할 지도 객체 
                averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정 
                minLevel: 5,
                zIndex: 3,
                texts: " ",
                styles: [{
                    width: '53px', height: '52px',
                    background: 'url(Recycle_center_active.svg) no-repeat',

                }] // 클러스터 할 최소 지도 레벨 
            });
        }


        overlay.setMap(null);

        kakao.maps.event.addListener(
            marker,
            "click",
            MarkerClick(map, marker, overlay)
        );

        kakao.maps.event.addListener(
            map,
            "click",
            closeOverlay(map, marker, overlay)
        );
    };


    function closeOverlay(map, marker, overlay) {


        return function () {
            overlay.setMap(null);
        }

    }

    var overlaylive = null;
    var serchedData;

    function MarkerClick(map, marker, overlay) {

        var Ma = marker.getPosition().Ma;
        var La = marker.getPosition().La;
        const MarkerlocPosition = new kakao.maps.LatLng(Ma, La)
        return function () {
            if (overlaylive) {
                overlaylive.setMap(null)
            }
            map.setCenter(MarkerlocPosition);
            overlay.setMap(map, marker)
            overlaylive = overlay;
            serchedData = marker.fb

        };
    }

    // 클린하우스 클러스터러에 마커들을 추가합니다(마커 클러스터러 관련)
    Cleanclusterer.addMarkers(Cleanmarkers);
    if (Recyclemarkers[0])
        Recycleclusterer.addMarkers(Recyclemarkers);

    return serchedData
}

