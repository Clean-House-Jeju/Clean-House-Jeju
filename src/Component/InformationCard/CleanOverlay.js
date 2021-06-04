import React from 'react'
import './InformCss/CustomOverlay.css';
import GetToday from './GetToday';
import closeOverlay from '../Map/loadMultiMarker';
function CleanOverlay(data, i) {
    // var clean = '<div class="wrap">' +
    //     '    <div class="info">' +
    //     '        <div class="title">' +
    //     `클린하우스` +
    //     '        </div>' +
    //     '        <div class="body">' +
    //     '            <div class="desc">' +
    //     '<div class="location-M">' + '위치 : ' + '</div>' +
    //     '<div class="location">' + `${data[i].location}` + '</div>' +
    //     '<div class="recycle">' + `${GetToday()}` + '<div class="jibun ellipsis">' +

    //     '            </div>' +
    //     '          </div>' +
    //     '        </div>' +
    //     '    </div>' +
    //     '</div>';

    var clean = '<div class="wrap">' +
        '    <div class="info">' +
        '        <div class="title">' +
        '            클린하우스' +
        '            <div class="close" onclick="closeOverlay()" title="닫기"></div>' +
        '        </div>' +
        '        <div class="body">' +
        '           </div>' +
        '            <div class="desc">' +
        '                <div class="location">제주특별자치도 제주시 첨단로 242</div>' +
        '                <div class="runtime">(우) 63309 (지번) 영평동 2181</div>' +
        '                <div><a href=https://www.kakaocorp.com/main" target="_blank" class="link">홈페이지</a></div>' +
        '            </div>' +
        '        </div>' +
        '    </div>' +
        '</div>';


    return clean;
}

export default CleanOverlay
