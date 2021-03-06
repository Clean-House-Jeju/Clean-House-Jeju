import React, { useEffect } from 'react';
import './Map.css';
import { useSelector } from "react-redux";
import NavBar from "../NavigationBar/NavBar";
import KakaoMapScript from "./KakaoMapScript";
import filterKeyword from "./filterKeyword";


const Map = React.memo(() => {
    const { data } = useSelector(state => state.getDatas.datas);
    const { text } = useSelector(state => state.keyword);

    useEffect(() => {

        KakaoMapScript(filterKeyword(data, text), text);
    }, [data, text])

    return (
        <div>
            <NavBar />
            <div id='myMap' />
        </div>
    );
})

export default Map;
