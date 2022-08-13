import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FieldActionType, FieldGridInfo, FieldInfo, Size } from "../../packages/grid/types/FieldTypes";

const gridInfoSliceInitState: {
   fields: FieldInfo[];
   grid: FieldGridInfo[];
   size: Size;
   modalStates: {
      show: boolean;
      editIndex: number;
   };
   fieldAction: FieldActionType | null;
} = {
   fields: [...Array(9)].map((x, index) => ({ id: index, colour: "#000000", title: index.toString(), content: "" })),
   grid: [...Array(9)].map((x, index) => ({ id: index, pos: { column: 0, row: 0 }, size: { x: 0, y: 0 } })),
   size: { x: 8, y: 30 },
   modalStates: { show: false, editIndex: -1 },
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
      setFieldModalState: (state, action: { payload: { show: boolean; editIndex?: number } }) => {
         state.modalStates.show = action.payload.show;
         if (action.payload.editIndex !== undefined) {
            state.modalStates.editIndex = action.payload.editIndex;
         } else if (!action.payload.show) {
            state.modalStates.editIndex = -1;
         }
      },
      setFieldAction: (state, action: PayloadAction<FieldActionType | null>) => {
         state.fieldAction = action.payload;
      },
   },
});

export const { setFieldsAndGrid, setFields, setGrid, setFieldModalState, setFieldAction } = gridInfoSlice.actions;
