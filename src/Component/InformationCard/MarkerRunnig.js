import React from 'react'
function MarkerRunnig(clean, recycle) {
    let today = new Date();
    let hours = today.getHours(); // 시간
    if (clean && !recycle) {
        if (15 <= hours <= 24 || 0 <= hours < 3) {

            var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png"



        }
        else {
            var imageSrc = "클린 비활성화.png"
        }
    }

    else if (recycle && !clean) {

        if (15 <= hours <= 24 || 0 <= hours < 3) {

            var imageSrc = 'https://i1.daumcdn.net/dmaps/apis/n_local_blit_04.png'

        }
        else {
            var imageSrc = "재활 비활성화.png"
        }
    }

    return imageSrc
}

export default MarkerRunnig
