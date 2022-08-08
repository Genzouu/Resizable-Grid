import { combineReducers } from "@reduxjs/toolkit";
import { gridSlice } from "./slices/gridSlice";

const reducers = combineReducers({
   grid: gridSlice.reducer,
});

export default reducers;
export type StateType = ReturnType<typeof reducers>;
