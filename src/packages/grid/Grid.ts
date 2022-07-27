import { GridField, GridPosition, Size } from "./types/GridTypes";

// Physical Positioning

// gets a grid position from x and y pixel values
export function getGridPosFromPos(xPos: number, yPos: number): GridPosition {
   const fieldContainer = document.getElementById("fields-container") as HTMLElement;
   const fieldContainerRect = fieldContainer.getBoundingClientRect();

   // add 10 to field container width to account for the column gap (5 on either side)
   const columnSize = (fieldContainerRect.width + 10) / 8;
   const column = Math.floor(xPos / columnSize + 1);

   const rowSize = (fieldContainerRect.height + 10) / 8;
   const row = Math.floor(yPos / rowSize + 1);

   return { column: column, row: row };
}

// gets the grid position of the mouse based on whether its in the middle of a grid position or not
export function getAdjustedGridPosFromMousePos(
   e: React.MouseEvent<HTMLDivElement, MouseEvent>,
   grabbedPos: { column: number; row: number }
): GridPosition {
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
export function getGridPosFromFieldPos(field: HTMLElement): { pos: GridPosition; size: Size } {
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
      pos: { column: columnRowStart.column, row: columnRowEnd.row },
      size: { x: columnRowEnd.column - columnRowStart.column + 1, y: columnRowEnd.row - columnRowStart.row + 1 },
   };
}

// Logical Positioning

// initialised a grid with fields of size 1x1
export function initialiseGridWithFields(grid: GridField[], gridSize: Size, fieldAmount: number) {
   let pos: GridPosition = { row: 1, column: 1 };
   for (let i = 0; i < fieldAmount; i++) {
      const field: GridField = { index: i, pos: { column: pos.column, row: pos.row }, size: { x: 1, y: 1 } };
      if (pos.column + 1 <= gridSize.x) {
         pos.column += 1;
      } else {
         pos.column = 0;
         pos.row += 1;
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
export function propagateChanges(grid: GridField[], gridSize: Size, modifiedFields: GridField[]): GridField[] | null {
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
            const pushAmount = field.pos.column + field.size.x - grid[i].pos.column;
            // if it can fit on the same row
            if (grid[i].pos.column + grid[i].size.x - 1 + pushAmount <= gridSize.x) {
               grid[i].pos.column += pushAmount;
            } else {
               // try and move to the next row
            }
            newModifiedFields.push(grid[i]);
         }
      }
   }
   return newModifiedFields.length > 0 ? newModifiedFields : null;
}

// switches positions of two fields
export function switchFieldPositions(grid: GridField[], fieldOne: number, fieldTwo: number) {
   for (let i = 0; i < grid.length; i++) {
      if (grid[i].index === fieldOne) {
         grid[i].index = fieldTwo;
      } else if (grid[i].index === fieldTwo) {
         grid[i].index = fieldOne;
      }
   }
}

// checks if two fields are overlapping
export function fieldsAreOverlapping(fieldOne: GridField, fieldTwo: GridField): boolean {
   if (
      fieldOne.pos.column > fieldTwo.pos.column + fieldTwo.size.x - 1 ||
      fieldOne.pos.column + fieldOne.size.x - 1 < fieldTwo.pos.column ||
      fieldOne.pos.row > fieldTwo.pos.row + fieldTwo.size.y - 1 ||
      fieldOne.pos.row + fieldOne.size.y - 1 < fieldOne.pos.row
   ) {
      return false;
   } else {
      return true;
   }
}

// Old Logical Positioning

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
