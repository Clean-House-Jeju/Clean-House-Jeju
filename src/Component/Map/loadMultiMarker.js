import CleanOverlay from '../InformationCard/CleanOverlay';
import MarkerRunnig from '../InformationCard/MarkerRunnig';
import RecycleOverlay from '../InformationCard/RecycleOverlay';

const { kakao } = window;



export default function LoadMultiMarker(map, data) {
    console.log(data);

    var markers = [];

    for (let i = 0; i < data.length; i++) {

        if (data[i].type == 'clean') {
            clean = true;
            recycle = false
            var imageSrc = MarkerRunnig(clean, recycle);
        }
        else if (data[i].type == 'recycle') {
            recycle = true;
            clean = false;
            var imageSrc = MarkerRunnig(clean, recycle);
        }
        // 마커 이미지의 이미지 크기 입니다
        let imageSize = new kakao.maps.Size(24, 35);

        // 마커 이미지를 생성합니다
        let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
        // 마커를 생성합니다


        var marker = new kakao.maps.Marker({
            map: map, // 마커를 표시할 지도
            position: new kakao.maps.LatLng(data[i].latitude, data[i].longitude), // 마커를 표시할 위치
            title: data[i].location, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
            image: markerImage,// 마커 이미지
            clickable: true
        });

        markers.push(marker);


        var clean = CleanOverlay(data, i);
        var recycle = RecycleOverlay(data, i);
        var iwRemoveable = true;


        if (data[i].type == 'clean') {
            var infowindow = new kakao.maps.InfoWindow({
                content: clean,
                removable: iwRemoveable
            });
        }
        else if (data[i].type == 'recycle') {
            var infowindow = new kakao.maps.InfoWindow({
                content: recycle,
                removable: iwRemoveable
            });
        }
        kakao.maps.event.addListener(
            marker,
            "click",
            MarkerClick(map, marker, infowindow)
        );
    };



    function MarkerClick(map, marker, infowindow) {

        var Ma = marker.getPosition().Ma;
        var La = marker.getPosition().La;
        const MarkerlocPosition = new kakao.maps.LatLng(Ma, La)

        return function () {
            infowindow.open(map, marker);
            map.setCenter(MarkerlocPosition);
        };
    }

    var clusterer = new kakao.maps.MarkerClusterer({
        map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체 
        averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정 
        minLevel: 6 // 클러스터 할 최소 지도 레벨 
    });

    // 클러스터러에 마커들을 추가합니다(마커 클러스터러 관련)
    clusterer.addMarkers(markers);

}



