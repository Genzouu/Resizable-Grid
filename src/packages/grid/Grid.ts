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
export function getAdjustedGridPosFromMousePos(e: React.MouseEvent<HTMLDivElement, MouseEvent>, grabbedPos: { column: number; row: number }): GridPosition {
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
      if ((prevGridPos.row < rowPos && relativeRowPosRatio >= resizeThreshold) || (prevGridPos.row > rowPos && relativeRowPosRatio <= 1 - resizeThreshold)) {
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
   const columnRowStart = getGridPosFromPos(fieldRect.left - fieldContainerRect.left + 10, fieldRect.top - fieldContainerRect.top + 10);
   const columnRowEnd = getGridPosFromPos(fieldRect.right - fieldContainerRect.left - 10, fieldRect.bottom - fieldContainerRect.top - 10);

   return {
      pos: { column: columnRowStart.column, row: columnRowStart.row },
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
         pos.column = 1;
         pos.row += 1;
      }
      grid[i] = field;
   }
}

// propagates the changes from a resized field. returns a list of fields that have been modified or null if the propagation has finished
export function propagateChanges(grid: GridField[], gridSize: Size, moveDirection: "right" | "down", modifiedFields: GridField[]): GridField[] | null {
   let newModifiedFields: GridField[] = [];
   for (let f = 0; f < modifiedFields.length; f++) {
      const movedField = modifiedFields[f];
      for (let i = 0; i < grid.length; i++) {
         if (grid[i].index === movedField.index) {
            //get the direction the field was moved in
            grid[i] = movedField;
            // if the movedField being checked has overlapped grid[i]
         } else if (fieldsAreOverlapping(movedField, grid[i])) {
            let newPos = getAdjacentPos(movedField, moveDirection, grid[i], gridSize.x);
            if (newPos.row > grid[i].pos.row && moveDirection === "right") {
               const newGridInfo = getNextEmptyPos(grid, gridSize.x, grid[i], newPos);
               // insert at new position to maintain order
               grid[i].pos = { column: newGridInfo.column, row: newGridInfo.row };
               if (newGridInfo.index !== i) {
                  const overlappedField = grid[i];
                  grid.splice(i, 1);
                  grid.splice(newGridInfo.index, 0, overlappedField);
                  i--;
               }
            } else {
               grid[i].pos = newPos;
            }
            newModifiedFields.push(grid[i]);
         }
      }
   }
   return newModifiedFields.length > 0 ? newModifiedFields : null;
}

// Gets the next empty pos that doesn't overlap with any previous fields
export function getNextEmptyPos(grid: GridField[], xGridSize: number, fieldToMove: GridField, startingPos: GridPosition): { index: number } & GridPosition {
   let tempField = { ...fieldToMove, pos: startingPos };
   let insertIndex = grid.findIndex((x) => x.index === fieldToMove.index);
   // check every field after the current field to see if it can fit at pos

   // should change this to get empty positions starting from a specified pos then try and put fieldToMove in those positions until it fits,
   // rather than move it to a position, if it overlaps then move it adjacent to that position, then keep doing that until it finds an empty position
   for (let i = 0; i < grid.length; i++) {
      if (fieldsAreOverlapping(grid[i], tempField)) {
         if (i > insertIndex) insertIndex = i;
         tempField.pos = getAdjacentPos(grid[i], "right", tempField, xGridSize);
         i = -1;
      }
   }
   return { index: insertIndex, ...tempField.pos };
}

// Gets the next empty position after a field
export function getAdjacentPos(field: GridField, direction: "right" | "down", movingField: GridField, xGridSize: number): GridPosition {
   // see how many positions it needs to be pushed right by
   // if it can't fit, move it to the next row and try again
   const pushAmount = direction === "right" ? field.pos.column + field.size.x - movingField.pos.column : field.pos.row + field.size.y - movingField.pos.row;
   // if it can fit on the same row
   if (movingField.pos.column + movingField.size.x - 1 + pushAmount <= xGridSize) {
      let pos = { column: movingField.pos.column, row: movingField.pos.row };
      if (direction === "right") {
         pos.column += pushAmount;
      } else {
         pos.row += pushAmount;
      }
      return pos;
   } else {
      // start looking from the start of the next row
      return { column: 1, row: movingField.pos.row + 1 };
   }
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
      fieldOne.pos.row + fieldOne.size.y - 1 < fieldTwo.pos.row
   ) {
      return false;
   } else {
      return true;
   }
}

// displays a grid as text to the console
export function displayGrid(grid: GridField[], xGridSize: number) {
   let indexGrid: number[][] = [];

   let gridText = "";
   for (let i = 0; i < grid.length; i++) {
      for (let y = grid[i].pos.row; y < grid[i].pos.row + grid[i].size.y; y++) {
         for (let x = grid[i].pos.column; x < grid[i].pos.column + grid[i].size.x; x++) {
            if (!indexGrid[y - 1]) indexGrid[y - 1] = [];
            indexGrid[y - 1][x - 1] = grid[i].index;
         }
      }
   }
   for (let y = 0; y < indexGrid.length; y++) {
      for (let x = 0; x < xGridSize; x++) {
         if (!indexGrid[y]) indexGrid[y] = [];
         if (indexGrid[y][x] !== undefined) {
            gridText += indexGrid[y][x];
            if (x !== xGridSize) {
               gridText += " ";
            }
         } else {
            gridText += "E ";
         }
      }
      gridText += "\n";
   }
   console.log(gridText);
}

// displays the fields in their order from top left to bottom right
export function displayFieldsInOrder(grid: GridField[]) {
   let fields: number[] = [];
   for (let i = 0; i < grid.length; i++) {
      if (!fields.includes(grid[i].index)) fields.push(grid[i].index);
   }
   let text = "";
   fields.forEach((x) => (text += x + " "));
   console.log(text);
}
