import * as api from "../lib/api";
import GetDistanceFromLatLonInKm from "../Component/Map/GetDistanceFromLatLonInKm";
import currentLatLon from "../Component/Map/currentLatLon";

const GET_DATAS = 'handleData/GET_DATA';
const GET_DATAS_SUCCESS = 'handleData/GET_DATA_SUCCESS';
const GET_DATAS_FAILURE = 'handleData/GET_DATA_FAILURE';
const location = {};


export const getInfo = () => async dispatch => {
    // 요청이 시작됨
    dispatch({type: GET_DATAS});
    try {
        // API를 호출
        const response = await api.getData();
        // 성공했을 때
        dispatch({
            type: GET_DATAS_SUCCESS,
            payload: response.data
        })
    } catch (e) {
        // 실패했을 떄
        dispatch({
            type: GET_DATAS_FAILURE,
            error: true
        })
    }
}

const initialState = {
    datas: {
        loading: false,
        data: null,
        error: null
    }
}

export default function getDatas(state = initialState, action) {

    switch (action.type) {
        case GET_DATAS:
            currentLatLon(location);
            return {
                ...state,
                datas: {
                    loading: true,
                    data: null,
                    error: null
                }
            }
        case GET_DATAS_SUCCESS:
            console.log(location);
            return {
                ...state,
                datas: {
                    loading: false,
                    data: action.payload.map(data => ({
                        ...data,
                        distance: parseFloat(GetDistanceFromLatLonInKm(
                            location.latitude,
                            location.longitude,
                            data.latitude,
                            data.longitude
                        ).toFixed(2))
                    })),
                    error: null
                }
            }
        case GET_DATAS_FAILURE:
            return {
                ...state,
                datas: {
                    loading: false,
                    data: null,
                    error: action.payload
                }
            }
        default:
            return state;

    }
}
