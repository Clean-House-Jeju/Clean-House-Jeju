import React from 'react'
import './InformCss/CustomOverlay.css';
import GetToday from './GetToday';

function CleanOverlay(data, i) {
    var clean = '<div class="wrap">' +
        '    <div class="info">' +
        '        <div class="title">' +
        `클린하우스` +
        '        </div>' +
        '        <div class="body">' +
        '            <div class="desc">' +
        '<div class="location-M">' + '위치 : ' + '</div>' +
        '<div class="location">' + `${data[i].location}` + '</div>' +
        '<div class="recycle">' + `${GetToday()}` + '<div class="jibun ellipsis">' +

        '            </div>' +
        '          </div>' +
        '        </div>' +
        '    </div>' +
        '</div>';

    return clean;
}

export default CleanOverlay
