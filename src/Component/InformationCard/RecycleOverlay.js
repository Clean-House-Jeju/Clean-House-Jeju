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
    if (timeStart < hours && hours < timeEnd)
        runningTime = '운영중'

    var recycle = '<div class="wrap">' +
        '    <div class="info">' +
        '        <div class="title">' +
        '            재활용 도움센터' +
        '        </div>' +
        '        <div class="body">' +
        '           </div>' +
        '            <div class="desc">' +
        '                <div class="location">' + `${data[i].location}` + '</div>' +
        '                <div class="runtime">' + `${runningTime}` + '</div>' +
        '                <div><a href="https://apis.map.kakao.com/" target="_blank" class="link">홈페이지</a></div>' +
        '            </div>' +
        '        </div>' +
        '    </div>' +
        '</div>';

    return recycle;
}
export default RecycleOverlay
