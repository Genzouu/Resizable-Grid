export interface GridPosition {
   column: { start: number; end: number };
   row: { start: number; end: number };
}

export interface GridField {
   index: number;
   topLeftPos: GridPosition2;
   size: { x: number; y: number };
}

export interface GridPosition2 {
   row: number;
   column: number;
}
