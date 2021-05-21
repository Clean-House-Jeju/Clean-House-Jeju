import './CustomOverlay.css'
import GetToday from './GetToday';

const { kakao } = window;



export default function LoadMultiMarker(map, data) {
    console.log(data);

    const imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

    for (let i = 0; i < data.length; i++) {


        // 마커 이미지의 이미지 크기 입니다
        let imageSize = new kakao.maps.Size(24, 35);

        // 마커 이미지를 생성합니다
        let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

        // 마커를 생성합니다
        var marker = new kakao.maps.Marker({
            map: map, // 마커를 표시할 지도
            position: new kakao.maps.LatLng(data[i].latitude, data[i].longitude), // 마커를 표시할 위치
            title: data[i].location, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
            image: markerImage // 마커 이미지
        });


        var clean = '<div class="wrap">' +
            '    <div class="info">' +
            '        <div class="title">' +
            `클린하우스` +
            '        </div>' +
            '        <div class="body">' +
            '            <div class="desc">' +
            '<div class="location">' + `위치 : ${data[i].location}` + '</div>' +
            '<div class="adress">' + `주소 : ${data[i].address}` + '</div>' +
            '<div class="recycle">' + `${GetToday()}` + '<div class="jibun ellipsis">' +

            '            </div>' +
            '          </div>' +
            '        </div>' +
            '    </div>' +
            '</div>';

        var recycle = '<div class="wrap">' +
            '    <div class="info">' +
            '        <div class="title">' +
            `재활용 도움 센터` +
            '        </div>' +
            '        <div class="body">' +
            `위치 : ${data[i].location}` +
            '            <div class="desc">' +
            '                <div class="ellipsis">' +
            `장소 : ${data[i].address}` + '</div>' +
            '                <div class="jibun ellipsis">' +
            '            </div>' +
            '        </div>' +
            '    </div>' +
            '</div>';



        if (data[i].type == 'clean') {
            var infowindow = new kakao.maps.InfoWindow({
                //content: data[i].location, // 인포윈도우에 표시할 내용
                content: clean
            });
        }
        else if (data[i].type == 'recycle') {
            var infowindow = new kakao.maps.InfoWindow({
                //content: data[i].location, // 인포윈도우에 표시할 내용
                content: recycle
            });
        }
        kakao.maps.event.addListener(
            marker,
            "mouseover",
            makeOverListener(map, marker, infowindow)

        );
        kakao.maps.event.addListener(
            marker,
            "mouseout",
            makeOutListener(infowindow)

        );
    };

    // 인포윈도우를 표시하는 클로저를 만드는 함수입니다
    function makeOverListener(map, marker, infowindow) {
        return function () {
            infowindow.open(map, marker);

        };
    }

    // 인포윈도우를 닫는 클로저를 만드는 함수입니다
    function makeOutListener(infowindow) {
        return function () {
            infowindow.close();

        };
    }


}



