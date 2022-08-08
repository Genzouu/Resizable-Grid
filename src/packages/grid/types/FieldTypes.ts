// export class FieldData implements FieldInfo, FieldGridInfo {
//    id: number;
//    title: string;
//    content: FieldContent;
//    pos: GridPosition;
//    size: Size;

//    constructor(id: number, title?: string, content?: string | string[], pos?: GridPosition, size?: Size) {
//       this.id = id;
//       this.title = "";
//       this.content = "";
//       this.pos = { column: 0, row: 0 };
//       this.size = { x: 0, y: 0 };

//       if (title !== undefined && content !== undefined) {
//          this.title = title;
//          this.content = content;
//       } else if (pos !== undefined && size !== undefined) {
//          this.pos = pos;
//          this.size = size;
//       }
//    }
// }

export interface FieldData extends FieldInfo, FieldGridInfo {}

export interface FieldInfo {
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
