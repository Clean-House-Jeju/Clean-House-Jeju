import React, {useEffect, useState} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import './ContentContainer.css'
import {useSelector} from "react-redux";
import filterKeyword from "../Map/filterKeyword";

export const ContentContainer = React.memo(() => {
    const {data} = useSelector(state => state.getDatas.datas);
    const {text} = useSelector(state => state.keyword);

    const d = filterKeyword(data, text);

    const [have, setHave] = useState(true);
    const [temp, setTemp] = useState([]);
    const [index, setIndex] = useState(0);

    const style = {
        height: 100,
        border: "1px solid green",
        margin: 6,
        padding: 8
    };

    useEffect(() => {
        setTemp([]);
        setIndex(0);
        dataLogic(5)
        console.log(index);
    }, []);

    const dataLogic = (num) => {
        if (d.length > num && d.length > 5) {
            setTemp(temp.concat(d.slice(index, index + 5)));
            setIndex(index + 5);
        } else if (d.length <= index) {
            setTemp(temp.concat(d.slice(index, d.length)));
            setIndex(d.length - 1);
        } else if (d.length === null || d.length === 0) {
            setHave(false);
        }
    }

    const handleData = (index) => {
        setTimeout(() => {
            dataLogic(index);
        }, 2000);
        console.log(index);
    }

    return (
        <div >
            <InfiniteScroll
                className='content-container-wrapper'
                dataLength={temp.length}
                next={() => handleData(index)}
                hasMore={have}
                loader={<h4>Loading...</h4>}
                scrollableTarget="content-wrapper"
            >
                {
                    temp.map((i, index) => (
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
