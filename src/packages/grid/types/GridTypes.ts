export interface GridField {
   index: number;
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
