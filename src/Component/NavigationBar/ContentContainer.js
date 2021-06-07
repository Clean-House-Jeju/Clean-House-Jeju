import React, {useEffect} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import './ContentContainer.css'
import {useDispatch, useSelector} from "react-redux";
import filterKeyword from "../Map/filterKeyword";
import {getCardData} from "../../Modules/cardData";

export const ContentContainer = React.memo(() => {
    const {data} = useSelector(state => state.getDatas.datas);
    const {text} = useSelector(state => state.keyword);
    const {index, cardData, have} = useSelector(state => state.cardData);
    const {isToggle} = useSelector(state => state.toggle);
    const dispatch = useDispatch();


    const style = {
        height: 100,
        border: "1px solid green",
        margin: 6,
        padding: 8
    };

    const handleCardData = () => {
        try {
            setTimeout(async () =>{
                await dispatch(getCardData(filterKeyword(data, text), index));
            }, 1000)
        }
        catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        if (isToggle) {
            handleCardData();
        }
    }, [data, text, isToggle]);

    return (
        <div >
            <InfiniteScroll
                className={isToggle?'content-container-wrapper': 'content-container-wrapper disable'}
                dataLength={cardData.length}
                next={isToggle && handleCardData}
                hasMore={have}
                loader={<h4>Loading...</h4>}
                endMessage={<h4>No Data...</h4>}
                scrollableTarget={isToggle? "content-wrapper": "content-wrapper content-wrapper-disabled"}
            >
                {
                    cardData.map((i, index) => (
                        <div style={style} key={index}>
                            {i.location}
                        </div>
                    ))
                }
            </InfiniteScroll>
        </div>
    );
})

export default ContentContainer;
