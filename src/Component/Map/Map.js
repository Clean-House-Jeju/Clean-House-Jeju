import React, {useEffect, useState} from 'react';
import Hamburger from "hamburger-react";
import './Map.css';
import {useDispatch, useSelector} from "react-redux";
import {getInfo} from "../../Modules/getDatas";

export default function Map() {
    const [isOpen, setOpen] = useState(false);
    const {data, loading, error} = useSelector(state => state.getDatas.datas);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getInfo());
    }, [dispatch]);

    if (loading) return <div>로딩중..</div>
    if (error) return <div>에러발생</div>
    if (!data) return <div>데이터가 없어요</div>;

    return (
        <div>
            <div style={{position: 'absolute', zIndex: '999'}}>
                <Hamburger toggled={isOpen} toggle={setOpen}/>
            </div>
            <div id='myMap'/>
        </div>
    );
}

