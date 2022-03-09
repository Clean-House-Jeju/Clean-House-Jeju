import React from 'react'
import '../InformationCard/InformCss/CustomOverlayCard.css'
function RecycleOverlayCard({ data }, { i }) {

    let today = new Date();
    let hours = today.getHours(); // 시간
    let timeEnd = data.timeEnd.split(':');
    timeEnd = parseInt(timeEnd[0]);
    let timeStart = data.timeStart.split(':');
    timeStart = parseInt(timeStart[0]);
    let Time = data.time;
    let runningTime = `운영마감 💤 (${Time})`;
    if (timeStart < hours && hours < timeEnd)
        runningTime = `운영중 ✅  (${Time})`

    return (
        <div className="item">
            <div className="infoC">
                <div className="title">
                    재활용 도움센터
            </div>
                <div className="body">
                    <div className="img">
                        <img src="recycle_center.svg" width={73} height={70} alt="리사이클 센터 이미지"/>
                    </div>
                    <div className="descC">
                        <div className="location"> {data.location}</div>
                        <div className="runtime"> {runningTime}</div>
                        <div>
                            <div className="far">거리:
                    <div className="distance">{data.distance} Km</div></div><div className="linkC"><a href="mailto:dndb3599@gmail.com?subject=신고">⚠️ 신고</a></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RecycleOverlayCard
