import { GridField, GridPosition, GridPosition2 } from "./types/GridTypes";

// Physical Positioning

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
      const resizeThreshold = 0.15;
      const relativeColumnPosRatio = columnPos - Math.floor(columnPos); // e.g 0.456
      if (
         (prevGridPos.column < columnPos && relativeColumnPosRatio >= resizeThreshold) ||
         (prevGridPos.column > columnPos && relativeColumnPosRatio <= 1 - resizeThreshold)
      ) {
         newColumn = Math.floor(columnPos);
      }

      const relativeRowPosRatio = rowPos - Math.floor(rowPos); // 0.456
      if (
         (prevGridPos.row < rowPos && relativeRowPosRatio >= resizeThreshold) ||
         (prevGridPos.row > rowPos && relativeRowPosRatio <= 1 - resizeThreshold)
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

// Logical Positioning

// initialised a grid with fields of size 1x1
export function initialiseGridWithFields(grid: GridField[], fields: number[]) {
   let topLeftPos: GridPosition2 = { row: 0, column: 0 };
   for (let i = 0; i < fields.length; i++) {
      const field: GridField = { index: i, topLeftPos: topLeftPos, size: { x: 1, y: 1 } };
      if (topLeftPos.column + 1 <= 8) {
         topLeftPos.column += 1;
      } else {
         topLeftPos.column = 0;
         topLeftPos.row += 1;
      }
      grid[i] = field;
   }
}

export function addFieldToGrid(grid: GridField[], fields: GridField) {
   // form an array of all the empty spaces in the grid between the first and last field
   // see if field can fit into one of the spaces
   // if not, put it at the end
}

// propagates the changes from a resized field. returns a list of fields that have been modified or null if the propagation has finished
export function propagateChanges(grid: GridField[], modifiedFields: GridField[]): GridField[] | null {
   let newModifiedFields: GridField[] = [];
   for (let f = 0; f < modifiedFields.length; f++) {
      const field = modifiedFields[f];
      for (let i = 0; i < grid.length; i++) {
         if (grid[i].index === field.index) {
            grid[i] = field;
            continue;
         }
         // if the field being checked has overlapped grid[i]
         if (fieldsAreOverlapping(grid[i], field)) {
            // see how many positions it needs to be pushed right by
            // if it can't fit, move it to the next row and try again
            const pushAmount = field.bottomRightPos.column - grid[i].topLeftPos.column + 1;
            // if it can fit on the same row
            if (grid[i].bottomRightPos.column + pushAmount <= 8) {
               grid[i].topLeftPos.column += pushAmount;
               grid[i].bottomRightPos.column += pushAmount;
            } else {
               grid[i].topLeftPos.row += 1;
               grid[i].topLeftPos.column = 0;
               grid[i].bottomRightPos.row += 1;
               grid[i].bottomRightPos.column = 0;
            }
            newModifiedFields.push(grid[i]);
         }
      }
   }
   return newModifiedFields.length > 0 ? newModifiedFields : null;
}

// checks if two fields are overlapping
export function fieldsAreOverlapping(fieldOne: GridField, fieldTwo: GridField): boolean {
   let curFieldOne = fieldOne;
   let curFieldTwo = fieldTwo;
   // check both positions
   for (let i = 1; i <= 2; i++) {
      if (
         curFieldOne.topLeftPos.column > curFieldTwo.topLeftPos.column + curFieldTwo.size.x - 1 ||
         curFieldOne.topLeftPos.column + curFieldOne.size.x - 1 < curFieldTwo.topLeftPos.column ||
         curFieldOne.topLeftPos.row > curFieldTwo.topLeftPos.row + curFieldTwo.size.y - 1 ||
         curFieldOne.topLeftPos.row + curFieldOne.size.y - 1 < curFieldOne.topLeftPos.row
      ) {
         curFieldOne = fieldTwo;
         curFieldTwo = fieldOne;
      } else {
         return true;
      }
   }
   return false;
}

// Old Logical Positioning

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

// switches the position of two indexes
export function switchFieldPositions(grid: number[][], indexOne: number, indexTwo: number) {
   for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
         if (grid[y][x] === indexOne) {
            grid[y][x] = indexTwo;
         } else if (grid[y][x] === indexTwo) {
            grid[y][x] = indexOne;
         }
      }
   }
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
