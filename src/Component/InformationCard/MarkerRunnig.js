import React from 'react'
function MarkerRunnig(clean, recycle, data, i) {
    let today = new Date();
    let hours = today.getHours(); // 시간
    let timeEnd = data[i].timeEnd.split(':');
    timeEnd = parseInt(timeEnd[0]);
    let timeStart = data[i].timeStart.split(':');
    timeStart = parseInt(timeStart[0]);
    hours -= 12;
    if (clean && !recycle) {

        if (3 < hours && hours < 15) {
            var imageSrc = "Clean_house_active_G.svg"
        }
        else {

            var imageSrc = "Clean_house_active.svg"



        }

    }

    else if (recycle && !clean) {

        if (timeStart < hours && hours < timeEnd) {
            var imageSrc = "Recycle_center_active.svg"
        }
        else {
            var imageSrc = "Recycle_center_active_G.svg"
        }

    }

    return imageSrc
}

export default MarkerRunnig
