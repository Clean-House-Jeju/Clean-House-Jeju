import React from 'react'
import './InformCss/CustomOverlay.css';

function RecycleOverlay(data, i) {
    let today = new Date();
    let hours = today.getHours(); // 시간
    let timeEnd = data[i].timeEnd.split(':');
    timeEnd = parseInt(timeEnd[0]);
    let timeStart = data[i].timeStart.split(':');
    timeStart = parseInt(timeStart[0]);
    let runningTime = '운영마감';
    let Time = data[i].time
    if (timeStart < hours && hours < timeEnd)
        runningTime = `운영중  (${Time})`

    var recycle = `<div class="wrap">
            <div class="info">
                <div class="title">
                    재활용 도움센터
                </div>
        <div class="body">
                    <div class="img">
                        <img src="Recycle_center.svg" width="73" height="70">
                   </div>
                    <div class="desc">
                        <div class="location"> ${data[i].location}</div>
                        <div class="runtime">${runningTime}</div>
                        <div>
                        <div class = 'far'>거리: 
                        <div class = 'distance'>${data[i].distance}km</div></div><div><a href="mailto:dndb3599@gmail.com?subject=신고">⚠️ 신고</a></div>
                    </div>
                </div>
            </div>
        </div>`;

    return recycle;
}
export default RecycleOverlay
