import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FieldActionType, FieldData, Size } from "../../packages/grid/types/FieldTypes";

const gridSliceInitState: {
   fields: FieldData[];
   size: Size;
   modalStates: {
      add: boolean;
      edit: boolean;
   };
   fieldAction: FieldActionType | null;
} = {
   fields: [...Array(9)].map((x, index) => ({ id: index, title: index.toString(), content: "", pos: { column: 0, row: 0 }, size: { x: 0, y: 0 } })),
   size: { x: 8, y: 30 },
   modalStates: { add: false, edit: false },
   fieldAction: null,
};

export const gridSlice = createSlice({
   name: "gridSlice",
   initialState: gridSliceInitState,
   reducers: {
      setFields: (state, action: PayloadAction<FieldData[]>) => {
         state.fields = action.payload;
      },
      addField: (state, action: PayloadAction<FieldData>) => {
         state.fields.push(action.payload);
      },
      deleteField: (state, action: PayloadAction<number>) => {
         state.fields.splice(action.payload, 1);
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

export const { setFields, setFieldAddState, setFieldEditState, setFieldAction } = gridSlice.actions;
