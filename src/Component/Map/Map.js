import React, {useEffect} from 'react';
import './Map.css';
import {useSelector} from "react-redux";
import NavBar from "../NavigationBar/NavBar";
import KakaoMapScript from "./KakaoMapScript";


export default function Map() {
    const {data} = useSelector(state => state.getDatas.datas);
    const {text} = useSelector(state => state.keyword);

    useEffect(() => {
        KakaoMapScript(data.filter(d => d.location.toLowerCase().includes(text)));
    }, [text])

    return (
        <div>
            <NavBar/>
            <div id='myMap'/>
        </div>
    );
}

