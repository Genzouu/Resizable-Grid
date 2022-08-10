import { combineReducers } from "@reduxjs/toolkit";
import { gridInfoSlice } from "./slices/gridInfoSlice";

const reducers = combineReducers({
   gridInfo: gridInfoSlice.reducer,
});

export default reducers;
export type StateType = ReturnType<typeof reducers>;
