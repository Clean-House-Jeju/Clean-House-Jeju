import * as api from "./api";

const GET_DATAS = 'handleData/GET_DATA';
const GET_DATAS_SUCCESS = 'handleData/GET_DATA_SUCCESS';
const GET_DATAS_FAILURE = 'handleData/GET_DATA_FAILURE';

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
            payload: e,
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

export default function handleDatas(state = initialState, action) {

    switch (action.type) {
        case GET_DATAS:
            return {
                ...state,
                datas: {
                    loading: true,
                    data: null,
                    error: null
                }
            }
        case GET_DATAS_SUCCESS:
            return {
                ...state,
                datas: {
                    loading: false,
                    data: action.payload,
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
