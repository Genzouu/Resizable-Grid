export interface GridPosition {
   column: { start: number; end: number };
   row: { start: number; end: number };
}

export interface GridField {
   index: number;
   topLeftPos: { row: number; column: number };
   bottomRightPos: { row: number; column: number };
}
