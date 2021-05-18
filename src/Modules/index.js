import {combineReducers} from "redux";
import getDatas from "./getDatas";
import keyword from "./keyword";

const rootReducer = combineReducers({
    keyword,
    getDatas
});

export default rootReducer;
