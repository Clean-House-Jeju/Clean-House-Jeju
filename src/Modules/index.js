import {combineReducers} from "redux";
import getDatas from "./getDatas";
import keyword from "./keyword";
import cardData from "./cardData";

const rootReducer = combineReducers({
    keyword,
    getDatas,
    cardData
});

export default rootReducer;
