import React from 'react'
import './InformCss/CustomOverlay.css';
import GetToday from './GetToday';
import closeOverlay from '../Map/loadMultiMarker';
import { Overlay } from 'react-bootstrap';

let today = new Date();
let hours = today.getHours(); // 시간
let runningTime = '운영중';
if (3 < hours && hours < 15)
    runningTime = '운영마감'
var i = 0;


function CleanOverlay(data, i) {


    var clean = `<div class="wrap">
    <div class="info">
        <div class="title">
            클린 하우스
        </div>
<div class="body">
            <div class="img">
                <img src="Clean_house.svg" width="73" height="70">
           </div>
            <div class="desc">
                <div class="location"> ${data[i].location}</div>
                <div class="runtime"> ${runningTime}</div>
                <div>
                <div class = 'far'>거리: 
                <div class = 'distance'>${data[i].distance}Km</div></div><div class="link"><a href="mailto:dndb3599@gmail.com?subject=신고">⚠️ 신고</a></div>
            </div>
        </div>
    </div>
</div>`;

    return clean;
}

export default CleanOverlay
