import CleanOverlay from '../InformationCard/CleanOverlay';
import MarkerRunnig from '../InformationCard/MarkerRunnig';
import RecycleOverlay from '../InformationCard/RecycleOverlay';

const { kakao } = window;

const makeCluster = ({map, gridSize, urlName}) => {

    return new kakao.maps.MarkerClusterer({
        map: map,
        gridSize: gridSize, // 마커들을 클러스터로 관리하고 표시할 지도 객체 
        averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정 
        minLevel: 5, // 클러스터 할 최소 지도 레벨 
        zIndex: 3,
        texts: " ",
        styles: [{
            width: '53px', height: '52px',
            background: `url(${urlName}) no-repeat`
        }]
    });
}

const makeOverlay = ({content, zIndex, map, position}) => {

    return new kakao.maps.CustomOverlay({
        content,
        zIndex,
        map,
        position,
        clickable: true
    });
}

const makeMarker = ({map, markerImage, data, markerArr}) => {

    const {latitude, longitude, location} = data;
    
    let marker = new kakao.maps.Marker({
        map: map, // 마커를 표시할 지도
        position: new kakao.maps.LatLng(latitude, longitude), // 마커를 표시할 위치
        title: location, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
        image: markerImage,// 마커 이미지
        zIndex: 5,
        clickable: true
    });

    markerArr.push(marker);

    return marker;
}


export default function LoadMultiMarker(map, data) {

    const Cleanmarkers = [];
    const Recyclemarkers = [];
    let Cleanclusterer = null;
    let Recycleclusterer = null; 

    for (let i = 0; i < data.length; i++) {

        const imageSrc = (data[i].type === 'clean') 
                         ? MarkerRunnig(true, false, data, i)
                         : MarkerRunnig(false, true, data, i)

        // 마커 이미지의 이미지 크기 입니다
        let imageSize = new kakao.maps.Size(24, 35);

        // 마커 이미지를 생성합니다
        let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
        // 마커를 생성합니다


        let marker = null;

        if (data[i].type === 'clean') {

            marker = makeMarker(
                {
                    map, 
                    markerImage, 
                    data: { latitude: data[i].latitude,  
                            longitude: data[i].longitude,
                            location: data[i].location
                          },
                    markerArr: Cleanmarkers
                });

        } else if (data[i].type === 'recycle') {

            marker = makeMarker(
                {
                    map, 
                    markerImage, 
                    data: { latitude: data[i].latitude,  
                            longitude: data[i].longitude,
                            location: data[i].location
                          },
                    markerArr: Recyclemarkers
                });
        }

        
        let overlay = null;
        const clean = CleanOverlay(data, i);
        const recycle = RecycleOverlay(data, i);

        if (data[i].type === 'clean') {

            overlay = makeOverlay({
                content: clean,
                zIndex: 8,
                map,
                position: marker.getPosition()
            });
        }
        else if (data[i].type === 'recycle') {

            overlay = makeOverlay({
                content: recycle,
                zIndex: 9,
                map,
                position: marker.getPosition()
            });
        }

        if (data[i].type === 'clean') {
            Cleanclusterer = makeCluster({map, gridSize: 100, urlName: 'Clean_house_active.svg'});
        }
        else if (data[i].type === 'recycle') {
            Recycleclusterer = makeCluster({map, gridSize: 150, urlName: 'Recycle_center_active.svg'});
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
            closeOverlay(overlay)
        );
    };


    function closeOverlay(overlay) {

        return function () {
            overlay.setMap(null);
        }

    }

    let overlaylive = null;
    let serchedData;

    function MarkerClick(map, marker, overlay) {

        const Ma = marker.getPosition().Ma;
        const La = marker.getPosition().La;
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
    Recycleclusterer.addMarkers(Recyclemarkers);


    return serchedData
}

