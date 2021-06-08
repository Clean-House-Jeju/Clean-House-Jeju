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
                클린하우스
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
    return clean;
}

export default CleanOverlay
