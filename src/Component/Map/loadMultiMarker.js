import './CustomOverlay.css'

const { kakao } = window;

var content = '<div class="wrap">' +
    '    <div class="info">' +
    '        <div class="title">' +
    '            카카오 스페이스닷원' +
    '            <div class="close" onclick="closeOverlay()"></div>' +
    '        </div>' +
    '        <div class="body">' +
    '            <div class="img">' +
    '                <img src="https://cfile181.uf.daum.net/image/250649365602043421936D" width="73" height="70">' +
    '           </div>' +
    '            <div class="desc">' +
    '                <div class="ellipsis">제주특별자치도 제주시 첨단로 242</div>' +
    '                <div class="jibun ellipsis">(우) 63309 (지번) 영평동 2181</div>' +
    '                <div><a href="https://www.kakaocorp.com/main" target="_blank" class="link">홈페이지</a></div>' +
    '            </div>' +
    '        </div>' +
    '    </div>' +
    '</div>';

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
            position: new kakao.maps.LatLng(data[i].latitude, data[i].longtitude), // 마커를 표시할 위치
            title: data[i].location, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
            image: markerImage // 마커 이미지


        });



        var overlay = new kakao.maps.CustomOverlay({
            content: content,
            map: map,

        });

        var infowindow = new kakao.maps.InfoWindow({
            //content: data[i].location, // 인포윈도우에 표시할 내용
            content: content
        });

        kakao.maps.event.addListener(
            marker,
            "mouseover",
            makeOverListener(map, marker, infowindow)
            //makeOverListener(map, marker, overlay)
        );
        kakao.maps.event.addListener(
            marker,
            "mouseout",
            makeOutListener(infowindow)
            // makeOutListener(overlay)
        );
    };

    // 인포윈도우를 표시하는 클로저를 만드는 함수입니다
    function makeOverListener(map, marker, customOverlay) {
        return function () {
            infowindow.open(map, marker);
            //customOverlay.setMap(map);
        };
    }

    // 인포윈도우를 닫는 클로저를 만드는 함수입니다
    function makeOutListener(customOverlay) {
        return function () {
            infowindow.close();
            //customOverlay.setMap(null);
        };
    }


}



