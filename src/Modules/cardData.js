
const INIT_CARD_DATA = 'cardData/INIT_CARD_DATA';
const GET_CARD_DATA = 'cardData/GET_CARD_DATA';
const GET_END_CARD_DATA = 'cardData/GET_END_CARD_DATA';
const SET_HAVE = 'cardData/SET_HAVE';
const NUM_GET_DATA = 5;

export const getCardData = (data, index) => dispatch => {

    if (data.length === null || data.length === 0) {
        dispatch({type: SET_HAVE});
    }
    else if (data.length <= NUM_GET_DATA || data.length <= index + 5) {
        dispatch({
            type: GET_END_CARD_DATA,
            payload: data
        });
    }
    else {
        dispatch({
            type: GET_CARD_DATA,
            payload: data
        });
    }
}

export const initCardData = () => ({
    type: INIT_CARD_DATA
})


const initialState = {
    index: 0,
    cardData: [],
    have: true
}

export default function cardData(state = initialState, action) {
    switch (action.type) {
        case INIT_CARD_DATA:
            return {
                ...state,
                index: 0,
                cardData: [],
                have: true
            }
        case SET_HAVE:
            return {
                ...state,
                index: 0,
                cardData: [],
                have: false
            }
        case GET_END_CARD_DATA:
            return {
                ...state,
                index: action.payload.length - 1,
                cardData: state.cardData.concat(action.payload.slice(state.index, action.payload.length)),
                have: false
            }
        case GET_CARD_DATA:
            return {
                ...state,
                index: state.index + NUM_GET_DATA,
                cardData: state.cardData.concat(action.payload.slice(state.index, state.index + NUM_GET_DATA)),
                have: true
            }
        default:
            return state;
    }
}
