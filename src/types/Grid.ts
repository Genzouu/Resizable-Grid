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
export function getNewGridOfSize(width: number, height: number): number[][] {
   let newGrid: number[][] = [];
   for (let y = 0; y < height; y++) {
      if (!newGrid[y]) {
         newGrid[y] = [];
      }
      for (let x = 0; x < width; x++) {
         if (!newGrid[y][x]) {
            newGrid[y][x] = -1;
         }
      }
   }
   return newGrid;
}

// finds a position for a field to fit into a grid based on where other fields are positioned
export function getEmptyGridSpace(grid: number[][], fieldWidth: number, fieldHeight: number): GridPosition | null {
   let pos = { column: { start: -1, end: -1 }, row: { start: -1, end: -1 } };

   const rowAmount = 30;
   for (let y = 0; y < rowAmount; y++) {
      for (let x = 0; x < grid[0].length; x++) {
         if (grid[y][x] === -1) {
            if (pos.column.start === -1) {
               if (grid[y].length - x >= fieldWidth && rowAmount - y >= fieldHeight) {
                  pos.column.start = x;
                  pos.row.start = y;
               } else {
                  break;
               }
            }
            if (x - pos.column.start + 1 === fieldWidth) {
               pos.column.end = x;
               for (let xx = pos.column.start; xx <= pos.column.end; xx++) {
                  let isEmpty = true;
                  for (let yy = pos.row.start; yy - pos.row.start < fieldHeight && yy < grid.length; yy++) {
                     if (grid[yy][xx] !== -1) {
                        isEmpty = false;

                        pos.column.start = -1;
                        pos.column.end = -1;
                        pos.row.start = -1;
                        pos.row.end = -1;

                        x = pos.column.start; // set x to column.start to see if it can be placed starting on the next column (the for loop will add 1)
                        break;
                     } else {
                        if (xx === pos.column.end && yy - pos.row.start + 1 === fieldHeight) {
                           pos.row.end = yy;
                           return pos;
                        }
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

// // gets
// export function getGridRowOverflow(grid: number[][], fieldWidth: number, fieldHeight: number): number | null {
//    let rowAmount = 0;

//    let pos = { column: -1, row: -1 };
//    // hard limit of 30 rows
//    for (let y = 0; y < 30; y++) {
//       for (let x = 0; x < grid[0].length; y++) {
//          // if the space is empty
//          if (grid[y][x] === -1) {
//             // if the starting column hasn't been set yet and the field can fit within the columns remaining, otherwise move to the next row
//             if (pos.column === -1) {
//                if (grid[0].length - x >= fieldWidth) {
//                   pos.column = x;
//                   pos.row = y;
//                } else {
//                   break;
//                }
//             }
//             // if each column in the current row that is needed to fit the field into it is empty
//             if (x - pos.column + 1 === fieldWidth) {
//                const xEnd = x + fieldWidth;
//                for (let xx = x; xx <= xEnd; xx++) {
//                   let invalid = false;
//                   for (let yy = y; yy < 30; yy++) {
//                      if (grid[yy][xx] !== -1) {
//                         invalid = true;
//                         break;
//                      } else {
//                         if (xx === xEnd && yy === 1) {
//                         }
//                      }
//                   }
//                   if (invalid) {
//                      break;
//                   }
//                }
//             }
//          }
//       }
//    }
//    return rowAmount;
// }

// gets the indexes in a grid in order from top left to bottom right position
export function getFieldsInOrder(grid: number[][]): number[] {
   let indexes: number[] = [];
   for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[0].length; x++) {
         if (grid[y][x] !== -1 && !indexes.includes(grid[y][x])) {
            indexes.push(grid[y][x]);
         }
      }
   }
   return indexes;
}

// adds a field (index) to a grid
export function addFieldToGrid(grid: number[][], index: number, pos: GridPosition) {
   for (let y = pos.row.start; y <= pos.row.end; y++) {
      for (let x = pos.column.start; x <= pos.column.end; x++) {
         grid[y][x] = index;
      }
   }
}

// initialises the grid with each field
export function initialiseGridWithFields(grid: number[][], fieldAmount: number): number[][] {
   let newGrid = [...grid];
   for (let i = 0; i < fieldAmount; i++) {
      let found = false;
      for (let y = 0; y < newGrid.length; y++) {
         for (let x = 0; x < newGrid[0].length; x++) {
            if (newGrid[y][x] === -1) {
               newGrid[y][x] = i;
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
   for (let y = 0; y < grid.length; y++) {
      if (grid[y][0] !== -1) {
         for (let x = 0; x < grid[0].length; x++) {
            gridText += grid[y][x] + 1;
            if (x !== grid.length) {
               gridText += " ";
            }
         }
         gridText += "\n";
      } else {
         break;
      }
   }
   console.log(gridText);
}
