import React, { useEffect, useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import './ContentContainer.css'
import { useDispatch, useSelector } from "react-redux";
import filterKeyword from "../Map/filterKeyword";
import { getCardData } from "../../Modules/cardData";
import CleanOverlayCard from '../InformationCard/CleanOverlayCard';
import RecycleOverlayCard from '../InformationCard/RecycleOverlayCard';



export const ContentContainer = React.memo(() => {
    const { data } = useSelector(state => state.getDatas.datas);
    const { text } = useSelector(state => state.keyword);
    const { index, cardData, have } = useSelector(state => state.cardData);
    const { isToggle } = useSelector(state => state.toggle);
    const dispatch = useDispatch();


    const handleCardData = useCallback(() => {
        try {
            setTimeout(async () => {
                dispatch(getCardData(filterKeyword(data, text), index));
            }, 1000)
        }
        catch (e) {
            console.log(e);
        }
    }, [data, dispatch, index, text]);

    useEffect(() => {
        if (isToggle) {
            handleCardData();
        }
    }, [data, text, isToggle, handleCardData]);



    return (
        <div >
            <InfiniteScroll
                className={isToggle ? 'content-container-wrapper' : 'content-container-wrapper disable'}
                dataLength={cardData.length}
                next={isToggle && handleCardData}
                hasMore={have}
                loader={<h4>Loading...</h4>}
                endMessage={<h4>No Data...</h4>}
                scrollableTarget={isToggle ? "content-wrapper" : "content-wrapper content-wrapper-disabled"}
            >
                {
                    cardData.map((i, index) => (
                        <div key={index}>
                            {i.type === "clean" ? (
                                <CleanOverlayCard data={i} />
                            ) : (
                                <RecycleOverlayCard data={i} />
                            )}
                        </div>
                    ))
                }
            </InfiniteScroll>
        </div>
    );
})

export default ContentContainer;
