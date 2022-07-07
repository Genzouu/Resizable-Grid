export interface GridPosition {
   column: { start: number; end: number };
   row: { start: number; end: number };
}

// gets a grid position from x and y pixel values
export function getGridPosFromPos(xPos: number, yPos: number): { column: number; row: number } {
   const fieldContainer = document.getElementById("fields-container") as HTMLElement;
   const fieldContainerRect = fieldContainer.getBoundingClientRect();

   // add 10 to field container width to account for the column gap (5 on either side)
   const columnSize = (fieldContainerRect.width + 10) / 8;
   // minimum value is 1 (in case xPos is 0)
   const column = Math.floor(xPos / columnSize + 1);

   const rowSize = (fieldContainerRect.height + 10) / 8;
   const row = Math.floor(yPos / rowSize + 1);

   return { column: column, row: row };
}

// gets the grid position of the mouse based on whether its in the middle of a grid position or not
export function getAdjustedGridPosFromMousePos(
   e: React.MouseEvent<HTMLDivElement, MouseEvent>,
   grabbedPos: { column: number; row: number }
): {
   column: number;
   row: number;
} {
   const fieldContainerRect = (document.getElementById("fields-container") as HTMLElement).getBoundingClientRect();

   const offsetPageX = e.pageX - fieldContainerRect.left + 5;
   const offsetPageY = e.pageY - fieldContainerRect.top + 5;

   // get column
   const columnSize = (fieldContainerRect.width + 10) / 8;
   const columnPos = offsetPageX / columnSize + 1; // e.g 2.456

   // get row
   const rowSize = (fieldContainerRect.height + 10) / 8;
   const rowPos = offsetPageY / rowSize + 1;

   const prevGridPos = grabbedPos;

   let newColumn = prevGridPos.column;
   let newRow = prevGridPos.row;
   if (prevGridPos.column !== Math.floor(columnPos) || prevGridPos.row !== Math.floor(rowPos)) {
      const relativeColumnPosRatio = columnPos - Math.floor(columnPos); // e.g 0.456
      if (
         (prevGridPos.column < columnPos && relativeColumnPosRatio >= 0.25) ||
         (prevGridPos.column > columnPos && relativeColumnPosRatio <= 0.75)
      ) {
         newColumn = Math.floor(columnPos);
      }

      const relativeRowPosRatio = rowPos - Math.floor(rowPos); // 0.456
      if (
         (prevGridPos.row < rowPos && relativeRowPosRatio >= 0.25) ||
         (prevGridPos.row > rowPos && relativeRowPosRatio <= 0.75)
      ) {
         newRow = Math.floor(rowPos);
      }
   }

   return { column: newColumn, row: newRow };
}

// gets a grid position based on the position of a field
export function getGridPosFromFieldPos(field: HTMLElement): GridPosition {
   const fieldContainerRect = field.parentElement!.getBoundingClientRect();
   const fieldRect = field.getBoundingClientRect();

   // get the grid pos of the start and end of a grid item
   const columnRowStart = getGridPosFromPos(
      fieldRect.left - fieldContainerRect.left + 10,
      fieldRect.top - fieldContainerRect.top + 10
   );
   const columnRowEnd = getGridPosFromPos(
      fieldRect.right - fieldContainerRect.left - 10,
      fieldRect.bottom - fieldContainerRect.top - 10
   );

   return {
      column: { start: columnRowStart.column, end: columnRowEnd.column },
      row: { start: columnRowStart.row, end: columnRowEnd.row },
   };
}

// returns a grid of the specified size with each position initialised with -1
export function getNewGridOfSize(sizeX: number, sizeY: number): number[][] {
   let newGrid: number[][] = [];
   for (let x = 0; x < sizeX; x++) {
      if (!newGrid[x]) {
         newGrid[x] = [];
      }
      for (let y = 0; y < sizeY; y++) {
         if (!newGrid[x][y]) {
            newGrid[x][y] = -1;
         }
      }
   }
   return newGrid;
}

// finds a position for a field to fit into a grid based on where other fields are positioned
export function findEmptyGridSpace(grid: number[][], fieldSizeX: number, fieldSizeY: number): GridPosition | null {
   let newGrid: number[][] = [...grid];
   let pos = { column: { start: -1, end: -1 }, row: { start: -1, end: -1 } };
   for (let y = 0; y < newGrid[0].length; y++) {
      for (let x = 0; x < newGrid.length; x++) {
         if (newGrid[x][y] === -1) {
            if (pos.column.start === -1) {
               if (newGrid.length - x >= fieldSizeX && newGrid[x].length - y >= fieldSizeY) {
                  pos.column.start = x;
                  pos.row.start = y;
               } else {
                  break;
               }
            }
            if (x - pos.column.start + 1 === fieldSizeX) {
               pos.column.end = x;
               for (let xx = pos.column.start; xx <= pos.column.end; xx++) {
                  let isEmpty = true;
                  for (let yy = pos.row.start; yy - pos.row.start < fieldSizeY && yy < newGrid[xx].length; yy++) {
                     if (newGrid[xx][yy] === -1 && xx === pos.column.end && yy - pos.row.start + 1 === fieldSizeY) {
                        pos.row.end = yy;
                        return pos;
                        // return from 1 to length instead of 0 to length-1
                        // return {
                        //    column: { start: pos.column.start + 1, end: pos.column.end + 1 },
                        //    row: { start: pos.column.end + 1, end: pos.column.end + 1 },
                        // };
                     } else if (newGrid[xx][yy] !== -1) {
                        isEmpty = false;

                        pos.column.start = -1;
                        pos.column.end = -1;
                        pos.row.start = -1;
                        pos.row.end = -1;

                        x = pos.column.start; // set x to column.start to see if it can be placed starting on the next column (the for loop will add 1)
                        break;
                     }
                  }
                  if (!isEmpty) break;
               }
            }
         } else if (pos.column.start !== -1) {
            pos.column.start = -1;
            pos.column.end = -1;
            pos.row.start = -1;
            pos.row.end = -1;
         }
      }
   }
   return null;
}

// gets the indexes in a grid in order from top left to bottom right position
export function getFieldsInOrder(grid: number[][]): number[] {
   let indexes: number[] = [];
   for (let y = 0; y < grid[0].length; y++) {
      for (let x = 0; x < grid.length; x++) {
         if (grid[x][y] !== -1 && !indexes.includes(grid[x][y])) {
            indexes.push(grid[x][y]);
         }
      }
   }
   return indexes;
}

// adds a field (index) to a grid
export function addFieldToGrid(grid: number[][], index: number, pos: GridPosition) {
   for (let y = pos.row.start; y <= pos.row.end; y++) {
      for (let x = pos.column.start; x <= pos.column.end; x++) {
         grid[x][y] = index;
      }
   }
}

// initialises the grid with each field
export function initialiseGrid(grid: number[][], fieldAmount: number): number[][] {
   let newGrid = [...grid];
   for (let i = 0; i < fieldAmount; i++) {
      let found = false;
      for (let y = 0; y < newGrid[0].length; y++) {
         for (let x = 0; x < newGrid.length; x++) {
            if (newGrid[x][y] === -1) {
               newGrid[x][y] = i;
               found = true;
               break;
            }
         }
         if (found) break;
      }
   }
   return newGrid;
}

// displays a grid as text to the console
export function displayGrid(grid: number[][]) {
   let gridText = "";
   for (let y = 0; y < grid[0].length; y++) {
      for (let x = 0; x < grid.length; x++) {
         gridText += grid[x][y];
         if (x !== grid.length) {
            gridText += " ";
         }
      }
      gridText += "\n";
   }
   console.log(gridText);
}
