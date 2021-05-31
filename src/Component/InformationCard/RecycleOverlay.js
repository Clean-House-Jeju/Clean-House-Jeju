import React from 'react'
import './InformCss/CustomOverlay.css';

function RecycleOverlay(data, i) {
    var recycle = '<div class="wrap">' +
        '    <div class="info">' +
        '        <div class="title">' +
        `재활용 도움 센터` +
        '        </div>' +
        '        <div class="body">' +
        '            <div class="desc">' +
        '<div class="location">' + `위치 : ${data[i].location}` + '</div>' +
        '            </div>' +
        '          </div>' +
        '        </div>' +
        '    </div>' +
        '</div>';


    return recycle;
}
export default RecycleOverlay
