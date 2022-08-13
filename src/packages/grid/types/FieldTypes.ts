export interface FieldInfo extends FieldContent {
   id: number;
   colour: string;
}

export interface FieldContent {
   title: string;
   content: string | string[];
}

export interface FieldGridInfo {
   id: number;
   pos: GridPosition;
   size: Size;
}

export interface GridPosition {
   column: number;
   row: number;
}

export interface Size {
   x: number;
   y: number;
}

export type FieldActionType = ResizeFieldType | RepositionFieldType;

type ResizeFieldType = {
   index: number;
   action: "resize";
   grabbedPos: { column: number; row: number };
};

type RepositionFieldType = {
   action: "reposition";
   idOne: number;
   indexOne: number;
   idTwo: number;
   indexTwo: number;
};
