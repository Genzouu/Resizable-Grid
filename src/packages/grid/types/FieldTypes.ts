export interface FieldData {
   title: string;
   content: FieldContent;
}

export type FieldContent = string | string[];

export type FieldActionType = {
   index: number;
} & (ResizeFieldType | RepositionFieldType);

type ResizeFieldType = {
   action: "resize";
   grabbedPos: { column: number; row: number };
};

type RepositionFieldType = {
   action: "reposition";
   targetIndex: number;
};
