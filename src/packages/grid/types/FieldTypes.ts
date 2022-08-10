export interface FieldInfo extends FieldContent {
   id: number;
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
