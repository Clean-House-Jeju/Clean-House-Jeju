import React from 'react'
import '../InformationCard/InformCss/CustomOverlayCard.css'
function CleanOverlayCard({ data }, { i }) {

    let today = new Date();
    let hours = today.getHours(); // 시간
    let runningTime = '운영중';
    if (3 < hours && hours < 15)
        runningTime = '운영마감'
    var i = 0;

    const style = {
        height: 100,
        border: "1px solid green",
        margin: 6,
        padding: 8
    };


    return (
        <div className="item">

            <div className="info">
                <div className="title2">
                    클린하우스
              </div>
                <div className="desc2">
                    <div className="markerbg"></div>
                    <div className="location2">{data.location}</div>
                    <div className="runtime2">{runningTime}</div>
                    <div><a href="mailto:dndb3599@gmail.com?subject=신고">신고</a> </div>
                </div>
            </div>
        </div >

    );
}

export default CleanOverlayCard
