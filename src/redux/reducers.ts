import { combineReducers } from "@reduxjs/toolkit";
import { fieldInfoSlice } from "./slices/fieldInfoSlice";

const reducers = combineReducers({
   fieldInfo: fieldInfoSlice.reducer,
});

export default reducers;
export type StateType = ReturnType<typeof reducers>;
