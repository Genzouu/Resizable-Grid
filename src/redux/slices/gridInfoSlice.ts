import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FieldActionType, FieldGridInfo, FieldInfo, Size } from "../../packages/grid/types/FieldTypes";

const gridInfoSliceInitState: {
   fields: FieldInfo[];
   grid: FieldGridInfo[];
   size: Size;
   modalStates: {
      add: boolean;
      edit: boolean;
   };
   fieldAction: FieldActionType | null;
} = {
   fields: [...Array(9)].map((x, index) => ({ id: index, title: index.toString(), content: "" })),
   grid: [...Array(9)].map((x, index) => ({ id: index, pos: { column: 0, row: 0 }, size: { x: 0, y: 0 } })),
   size: { x: 8, y: 30 },
   modalStates: { add: false, edit: false },
   fieldAction: null,
};

export const gridInfoSlice = createSlice({
   name: "gridInfoSlice",
   initialState: gridInfoSliceInitState,
   reducers: {
      setFieldsAndGrid: (state, action: { payload: { fields: FieldInfo[]; grid: FieldGridInfo[] } }) => {
         state.fields = action.payload.fields;
         state.grid = action.payload.grid;
      },
      setFields: (state, action: PayloadAction<FieldInfo[]>) => {
         state.fields = action.payload;
      },
      setGrid: (state, action: PayloadAction<FieldGridInfo[]>) => {
         state.grid = action.payload;
      },
      setFieldAddState: (state, action: PayloadAction<boolean>) => {
         state.modalStates.add = action.payload;
      },
      setFieldEditState: (state, action: PayloadAction<boolean>) => {
         state.modalStates.edit = action.payload;
      },
      setFieldAction: (state, action: PayloadAction<FieldActionType | null>) => {
         state.fieldAction = action.payload;
      },
   },
});

export const { setFieldsAndGrid, setFields, setGrid, setFieldAddState, setFieldEditState, setFieldAction } = gridInfoSlice.actions;
