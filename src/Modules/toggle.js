const OPEN_TOGGLE = 'toggle/OPEN_TOGGLE';
const CLOSE_TOGGLE = 'toggle/CLOSE_TOGGLE';

export const openToggle = () => ({type: OPEN_TOGGLE});
export const closeToggle = () => ({type: CLOSE_TOGGLE});

const initialState = {
    isToggle: false
}

export default function toggle(state = initialState, action) {
    switch (action.type) {
        case OPEN_TOGGLE:
            return {
                ...state,
                isToggle: true
            }
        case CLOSE_TOGGLE:
            return {
                ...state,
                isToggle: false
            }
        default:
            return state;
    }
}
