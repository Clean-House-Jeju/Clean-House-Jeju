import React from 'react'
import './InformCss/CustomOverlay.css';
import GetToday from './GetToday';
function RecycleOverlay(data, i) {

    {
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

        return recycle;
    }
}

export default RecycleOverlay
