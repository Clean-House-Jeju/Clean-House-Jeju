import React, {useEffect} from 'react';
import Map from "./Component/Map/Map";
import {Reset} from "styled-reset";
import KakaoMapScript from "./Component/Map/KakaoMapScript";
import {useSelector} from "react-redux";

export default function App() {

  return (
      <div className="App">
          <Reset/>
        <Map/>
      </div>
  );
}
