
const SET_KEYWORD = 'keyword/SET_KEYWORD';

export const setKeyword = (keyword) => ({
    type: SET_KEYWORD,
    keyword
});

const initialState = {
    text: ''
}

export default function keyword(state = initialState, action) {
    switch (action.type) {
        case SET_KEYWORD:
            return {
                ...state,
                text: action.keyword
            };
        default:
            return state;
    }
}
