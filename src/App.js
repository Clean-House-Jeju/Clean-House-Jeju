import React, {useEffect} from 'react';
import Map from "./Component/Map/Map";
import {Reset} from "styled-reset";
import KakaoMapScript from "./Component/Map/KakaoMapScript";
import {useDispatch, useSelector} from "react-redux";
import {getInfo} from "./Modules/getDatas";

export default function App() {
    const {data, loading, error} = useSelector(state => state.getDatas.datas);
    const dispatch = useDispatch();
    useEffect(() => {
        const fn = async () => {
            try{
                await dispatch(getInfo());
            } catch (e) {
                console.log(e);
            }
        };
        fn();
    }, [dispatch]);

    if (loading) return <div>로딩중..</div>
    if (error) return <div>에러발생</div>
    if (!data) return <div>데이터가 없어요</div>;


  return (
      <div className="App">
          <Reset/>
        <Map/>
      </div>
  );
}
