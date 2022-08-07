import React, { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";

import {
   displayFieldsInOrder,
   displayGrid,
   getAdjustedGridPosFromMousePos,
   getGridPosFromFieldPos,
   initialiseGridWithFields,
   modifyGrid,
   propagateChanges,
   switchFieldPositions,
} from "../packages/grid/Grid";
import Field from "./Field";
import "../styles/Grid.scss";
import { GridField, Size } from "../packages/grid/types/GridTypes";
import { useDispatch, useSelector } from "react-redux";
import { StateType } from "../redux/reducers";
import { setFieldAction, setFieldAddState } from "../redux/slices/fieldInfoSlice";

export default function Grid() {
   const dispatch = useDispatch();
   const fieldInfo = useSelector((state: StateType) => state.fieldInfo);

   const [gridInfo, setGrid] = useState<{ size: Size; grid: GridField[] }>({
      size: { x: 8, y: 30 },
      grid: [],
   });

   useEffect(() => {
      let grid: GridField[] = [];
      initialiseGridWithFields(grid, gridInfo.size, fieldInfo.fields.length);
      updateGrid(grid);

      setGrid({ ...gridInfo, grid: grid });
   }, []);

   useEffect(
      () => handleFieldReposition(),
      [fieldInfo.fieldAction && fieldInfo.fieldAction.action === "reposition" && fieldInfo.fieldAction.targetIndex !== -1 ? fieldInfo.fieldAction.index : null]
   );

   useEffect(() => {
      // if a new field has been added
      if (fieldInfo.fields.length > gridInfo.grid.length && gridInfo.grid.length !== 0) {
         let newGrid = [...gridInfo.grid];
         modifyGrid(newGrid, gridInfo.size, "add", fieldInfo.fields.length);
         updateGrid(newGrid);
         setGrid({ size: gridInfo.size, grid: newGrid });
      }
   }, [fieldInfo.fields.length]);

   function handleFieldResize(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
      if (fieldInfo.fieldAction && fieldInfo.fieldAction.action === "resize") {
         const resizedField = (document.getElementById("field-container") as HTMLElement).children[fieldInfo.fieldAction.index] as HTMLElement;
         const curGridPos = getGridPosFromFieldPos(resizedField);

         const targetGridPos = getAdjustedGridPosFromMousePos(e, fieldInfo.fieldAction.grabbedPos);
         if (fieldInfo.fieldAction.grabbedPos !== targetGridPos) {
            dispatch(
               setFieldAction({
                  ...fieldInfo.fieldAction,
                  grabbedPos: { column: targetGridPos.column, row: targetGridPos.row },
               })
            );
         }

         let newFieldSize: Size = { ...curGridPos.size };
         if (targetGridPos.column !== curGridPos.pos.column + curGridPos.size.x - 1) {
            newFieldSize.x = targetGridPos.column - curGridPos.pos.column + 1;
         }
         if (targetGridPos.row !== curGridPos.pos.row + curGridPos.size.y - 1) {
            newFieldSize.y = targetGridPos.row - curGridPos.pos.row + 1;
         }

         if (curGridPos.size.x !== newFieldSize.x || curGridPos.size.y !== newFieldSize.y) {
            updateGrid(gridInfo.grid, { index: fieldInfo.fieldAction.index, pos: curGridPos.pos, size: newFieldSize });
         }
      }
   }

   function handleFieldReposition() {
      if (fieldInfo.fieldAction?.action === "reposition") {
         if (fieldInfo.fieldAction.targetIndex !== -1) {
            let newGrid = [...gridInfo.grid];
            switchFieldPositions(newGrid, fieldInfo.fieldAction.index, fieldInfo.fieldAction.targetIndex);
            updateGrid(newGrid);
            dispatch(setFieldAction(null));
         }
      }
   }

   function updateGrid(grid: GridField[], resizedField?: GridField) {
      let newGrid = [...grid];
      if (resizedField) {
         let newModifiedFields: GridField[] | null = [{ ...resizedField }];

         const resizedFieldIndex = grid.findIndex((x) => x.index === resizedField.index);
         const moveDirection =
            resizedField.pos.column + resizedField.size.x - 1 > grid[resizedFieldIndex].pos.column + grid[resizedFieldIndex].size.x - 1 ? "right" : "down";

         // counter to stop it if it's looping forever (while I fix propagateChanges())
         let counter = 0;
         while (newModifiedFields !== null && counter <= 100) {
            newModifiedFields = propagateChanges(newGrid, gridInfo.size, moveDirection, newModifiedFields!);
            counter++;
         }
         if (counter >= 100) console.log("infinite loop");
      }
      for (let i = 0; i < fieldInfo.fields.length; i++) {
         for (let ii = 0; ii < newGrid.length; ii++) {
            if (newGrid[ii].index === i) {
               const fieldData = newGrid[ii];
               const field = document.getElementById("field-container")?.children[i] as HTMLElement;
               field.style.gridColumn = `${fieldData.pos.column} / span ${fieldData.size.x}`;
               field.style.gridRow = `${fieldData.pos.row} / span ${fieldData.size.y}`;
            }
         }
      }
      displayFieldsInOrder(newGrid);
      displayGrid(newGrid, gridInfo.size.x);

      setGrid({ size: gridInfo.size, grid: newGrid });
   }

   function handleMouseUp() {
      if (fieldInfo.fieldAction) {
         const resizedField = (document.getElementById("field-container") as HTMLElement).children[fieldInfo.fieldAction.index] as HTMLElement;
         resizedField.style.cursor = "grab";
         if (fieldInfo.fieldAction.action === "resize") {
            (document.getElementsByClassName("grid-lines-overlay")[0] as HTMLElement).style.display = "none";
            dispatch(setFieldAction(null));
         }
      }
   }

   function handleOnScroll() {
      const grid = document.getElementsByClassName("grid")[0] as HTMLElement;
      const gridOverlay = document.getElementsByClassName("grid-lines-overlay")[0] as HTMLElement;

      gridOverlay.style.backgroundPositionY = `calc(-7.5px - ${grid.scrollTop}px)`;
   }

   return (
      <div className="grid" onMouseMove={(e) => handleFieldResize(e)} onMouseUp={() => handleMouseUp()} onScroll={() => handleOnScroll()}>
         <div id="field-container" className="field-container">
            {fieldInfo.fields.map((field, index) => (
               <Field title={field.title} content={field.content} index={index} key={index} />
            ))}
         </div>
         <div className="grid-lines-overlay" />
         <AiOutlinePlus className="add-field" onClick={() => dispatch(setFieldAddState(true))}></AiOutlinePlus>
      </div>
   );
}
