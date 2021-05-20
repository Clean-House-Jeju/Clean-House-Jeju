import React from 'react';
const { kakao } = window;

export default function GetToday() {
    var week = new Array('일', '월', '화', '수', '목', '금', '토');
    var today = new Date();
    var day = today.getDate();
    var dayName = week[today.getDay()];
    if (dayName == '월' || '수' || '금')
        return '🥡';
}
