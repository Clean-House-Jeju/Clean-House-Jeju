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
        '<div class="location">' + `위치 : ${data[i].location}` + '</div>' +
        '<div class="adress">' + `주소 : ${data[i].address}` + '</div>' +
        '<div class="recycle">' + `${GetToday()}` + '<div class="jibun ellipsis">' +

        '            </div>' +
        '          </div>' +
        '        </div>' +
        '    </div>' +
        '</div>';

    return clean;
}

export default CleanOverlay
