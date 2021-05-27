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
            }, 2000)
        }
        catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        handleCardData();
    }, [data, text]);

    return (
        <div >
            <InfiniteScroll
                className='content-container-wrapper'
                dataLength={cardData.length}
                next={handleCardData}
                hasMore={have}
                loader={<h4>Loading...</h4>}
                scrollableTarget="content-wrapper"
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
