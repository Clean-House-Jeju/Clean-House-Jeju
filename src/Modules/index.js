import {combineReducers} from "redux";
import getDatas from "./getDatas";
import keyword from "./keyword";
import cardData from "./cardData";
import toggle from "./toggle";

const rootReducer = combineReducers({
    keyword,
    getDatas,
    cardData,
    toggle
});

export default rootReducer;
