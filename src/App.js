import React, {useEffect} from 'react';
import Map from "./Component/Map/Map";
import {Reset} from "styled-reset";
import {useDispatch, useSelector} from "react-redux";
import {getInfo} from "./Modules/getDatas";
import Loading from "./Component/Loading/Loading";

export default function App() {
    const {data, loading, error} = useSelector(state => state.getDatas.datas);

    const dispatch = useDispatch();

    useEffect(() => {
        const fn = async () => {
            try{
                dispatch(getInfo());
            } catch (e) {
                console.log(e);
            }
        };
        fn();
    });

    if (loading) return <Loading/>
    if (error) return <div>에러발생</div>
    if (!data) return <div>데이터가 없어요</div>;


  return (
      <div className="App">
          <Reset/>
        <Map/>
      </div>
  );
}
