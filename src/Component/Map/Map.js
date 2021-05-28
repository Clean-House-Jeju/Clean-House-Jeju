import React, { useEffect } from 'react';
import './Map.css';
import { useSelector } from "react-redux";
import NavBar from "../NavigationBar/NavBar/NavBar";
import KakaoMapScript from "./KakaoMapScript";
import filterKeyword from "./filterKeyword";
import currentLatLon from "./currentLatLon";


const Map = React.memo(() => {
    const { data } = useSelector(state => state.getDatas.datas);
    const { text } = useSelector(state => state.keyword);

    useEffect(() => {

        KakaoMapScript(filterKeyword(data, text), text);
    }, [text])

    return (
        <div>
            <NavBar />
            <div id='myMap' />
        </div>
    );
})

export default Map;
