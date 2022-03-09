import * as api from "../lib/api";
import GetDistanceFromLatLonInKm from "../Component/Map/GetDistanceFromLatLonInKm";


const GET_DATAS = 'handleData/GET_DATA';
const GET_DATAS_SUCCESS = 'handleData/GET_DATA_SUCCESS';
const GET_DATAS_FAILURE = 'handleData/GET_DATA_FAILURE';


export const getInfo = (location) => async dispatch => {
    // 요청이 시작됨
    dispatch({ type: GET_DATAS });
    
    try {
        // API를 호출
        const response = await api.getData();

        const data = response.data.map(data => ({
            ...data,
            distance: parseFloat(GetDistanceFromLatLonInKm(
                location.latitude,
                location.longitude,
                data.latitude,
                data.longitude
            ).toFixed(2))
        }));

        dispatch({
            type: GET_DATAS_SUCCESS,
            payload: {
                data
            }
        })
    } catch (e) {
        // 실패했을 떄
        console.log(e);
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
        error: null,
    }
}

export default function getDatas(state = initialState, action) {
    switch (action.type) {
        case GET_DATAS:
            
            return {
                ...state,
                datas: {
                    loading: true,
                    data: null,
                    error: null,
                }
            }
        case GET_DATAS_SUCCESS:
            return {
                ...state,
                datas: {
                    loading: false,
                    data: action.payload.data,
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
