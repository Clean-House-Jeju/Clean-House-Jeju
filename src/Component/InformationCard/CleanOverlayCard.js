import React from 'react'
import '../InformationCard/InformCss/CustomOverlayCard.css'
function CleanOverlayCard({ data }) {

    let today = new Date();
    let hours = today.getHours(); // 시간
    let runningTime = '운영중 ✅';
    if (3 < hours && hours < 15)
        runningTime = '운영마감 💤'

    return (
        <div className="item">
            <div className="infoC">
                <div className="title">
                    클린 하우스
            </div>
                <div className="body">
                    <div className="img">
                        <img src="Clean_house.svg" width={73} height={70} alt="클린하우스 이미지"/>
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

export default CleanOverlayCard
