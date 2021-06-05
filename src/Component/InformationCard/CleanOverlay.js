import React from 'react'
import './InformCss/CustomOverlay.css';
import GetToday from './GetToday';
import closeOverlay from '../Map/loadMultiMarker';
import { Overlay } from 'react-bootstrap';
function CleanOverlay(data, i) {

    let today = new Date();
    let hours = today.getHours(); // 시간
    let runningTime = '운영중';
    if (3 < hours && hours < 15)
        runningTime = '운영마감'
    var i = 0;

    var clean = `<div class="wrap">
        <div class="info">
            <div class="title">
                클린하우스
          <div class="close" onclick=""title="닫기"></div>
    </div>
            <div class="body">
               </div>
                <div class="desc">
                    <div class="location">${data[i].location}</div>
                    <div class="runtime">${runningTime}</div>
                    <div><a href="https://apis.map.kakao.com/" target="_blank" class="link">홈페이지</a></div>
                </div>
            </div>
        </div>
    </div>`;

    //------------- 삽질 추가 -------------//

    // var wrap = document.createElement('div');
    // wrap.className = 'wrap';

    // var info = document.createElement('div');
    // info.className = 'info';

    // wrap.appendChild(info);

    // var title = document.createElement('div');
    // title.className = "title";
    // title.innerText = "시발";
    // //var sometext = document.createTextNode("추가된거");

    // //title.appendChild(sometext);
    // //info.appendChild(title);

    // var close = document.createElement('button');
    // close.innerHTML = '닫기';
    // close.onclick = closeOverlay();

    // title.appendChild(close);
    // overlay.setContent(title);

    //------------- 마무리 -------------//
    return clean;
}

export default CleanOverlay
