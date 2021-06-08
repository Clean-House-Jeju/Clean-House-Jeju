import React from 'react'
import '../InformationCard/InformCss/CustomOverlayCard.css'
function CleanOverlayCard({ data }, { i }) {

    let today = new Date();
    let hours = today.getHours(); // 시간
    let runtime = data.time;
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

            <div className="Cleaninfo">
                <div className="Cleantitle">
                    클린하우스
              </div>
                <div className="Cleandesc">
                    <div className="Cmarkerbg"></div>
                    <div className="Clocation">{data.location}</div>
                    <div className="Crunningtime">{runningTime} ({runtime})</div>
                    <div className="Cdistance">{data.distance}</div>
                    <div className="link"><a href="mailto:dndb3599@gmail.com?subject=신고">신고</a> </div>
                </div>
            </div>
        </div >

    );
}

export default CleanOverlayCard
