import React from 'react'
function MarkerRunnig(clean, recycle, data, i) {
    let today = new Date();
    let hours = today.getHours(); // 시간
    let timeEnd = data[i].timeEnd.split(':');
    timeEnd = parseInt(timeEnd[0]);
    let timeStart = data[i].timeStart.split(':');
    timeStart = parseInt(timeStart[0]);
    if (clean && !recycle) {

        if (3 < hours && hours < 15) {
            var imageSrc = "클린 비활성화.png"
        }
        else {

            var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png"



        }

    }

    else if (recycle && !clean) {

        if (timeStart < hours && hours < timeEnd) {
            var imageSrc = 'https://i1.daumcdn.net/dmaps/apis/n_local_blit_04.png'
        }
        else {
            var imageSrc = "재활 비활성화.png"
        }

    }

    return imageSrc
}

export default MarkerRunnig
