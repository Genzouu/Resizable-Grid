import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FieldActionType, FieldData } from "../../packages/grid/types/FieldTypes";

const fieldInfoSliceInitState: {
   fields: FieldData[];
   modalStates: {
      add: boolean;
      edit: boolean;
   };
   fieldAction: FieldActionType | null;
} = {
   fields: [
      {
         title: "0",
         content: "",
      },
      {
         title: "1",
         content: "",
      },
      {
         title: "2",
         content: "",
      },
      {
         title: "3",
         content: "",
      },
      {
         title: "4",
         content: "",
      },
      {
         title: "5",
         content: "",
      },
      {
         title: "6",
         content: "",
      },
      {
         title: "7",
         content: "",
      },
      {
         title: "8",
         content: "",
      },
   ],
   modalStates: { add: false, edit: false },
   fieldAction: null,
};

export const fieldInfoSlice = createSlice({
   name: "fieldInfoSlice",
   initialState: fieldInfoSliceInitState,
   reducers: {
      setFields: (state, action: PayloadAction<FieldData[]>) => {
         state.fields = action.payload;
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

export const { setFields, setFieldAddState, setFieldEditState, setFieldAction } = fieldInfoSlice.actions;
