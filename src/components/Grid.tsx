import React, { useEffect } from "react";
import { AiOutlinePlus } from "react-icons/ai";

import {
   displayFieldsInOrder,
   displayGrid,
   getAdjustedGridPosFromMousePos,
   getGridPosFromFieldPos,
   initialiseGridWithFields,
   propagateChanges,
   removeFromGrid,
   switchFieldPositions,
} from "../packages/grid/Grid";
import Field from "./Field";
import "../styles/Grid.scss";
import { useDispatch, useSelector } from "react-redux";
import { StateType } from "../redux/reducers";
import { setFieldAction, setFieldAddState, setFieldsAndGrid, setGrid } from "../redux/slices/gridInfoSlice";
import { FieldGridInfo, Size } from "../packages/grid/types/FieldTypes";
import { useContextMenuContext } from "../context/ContextMenuContext";

export default function Grid() {
   const dispatch = useDispatch();
   const gridInfo = useSelector((state: StateType) => state.gridInfo);

   const contextMenuContext = useContextMenuContext();

   useEffect(() => {
      let newGrid: FieldGridInfo[] = [...gridInfo.grid];
      initialiseGridWithFields(newGrid, gridInfo.size, gridInfo.grid.length);
      updatePhysicalGrid(newGrid);
      dispatch(setGrid(newGrid));
   }, []);

   useEffect(
      () => handleFieldReposition(),
      [gridInfo.fieldAction && gridInfo.fieldAction.action === "reposition" && gridInfo.fieldAction.targetIndex !== -1 ? gridInfo.fieldAction.index : null]
   );

   useEffect(() => {
      // if a new field has been added
      updatePhysicalGrid(gridInfo.grid);
   }, [gridInfo.grid.length]);

   function handleFieldResize(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
      if (gridInfo.fieldAction && gridInfo.fieldAction.action === "resize") {
         const resizedField = (document.getElementById("field-container") as HTMLElement).children[gridInfo.fieldAction.index] as HTMLElement;
         const curGridPos = getGridPosFromFieldPos(resizedField);
         const targetGridPos = getAdjustedGridPosFromMousePos(e, gridInfo.fieldAction.grabbedPos);
         if (gridInfo.fieldAction.grabbedPos !== targetGridPos) {
            dispatch(
               setFieldAction({
                  ...gridInfo.fieldAction,
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
            let newGrid = [...gridInfo.grid];
            updateLogicalGrid(newGrid, { id: gridInfo.fields[gridInfo.fieldAction.index].id, pos: curGridPos.pos, size: newFieldSize });
            updatePhysicalGrid(newGrid);
            dispatch(setGrid(newGrid));
         }
      }
   }

   function handleFieldReposition() {
      if (gridInfo.fieldAction?.action === "reposition") {
         if (gridInfo.fieldAction.targetIndex !== -1) {
            let newGrid = [...gridInfo.grid];
            switchFieldPositions(newGrid, gridInfo.fieldAction.index, gridInfo.fieldAction.targetIndex);
            updatePhysicalGrid(newGrid);
            dispatch(setGrid(newGrid));
            displayGrid(newGrid, gridInfo.size.x);

            dispatch(setFieldAction(null));
         }
      }
   }

   // updates a logical gridInfo.in response to changes
   function updateLogicalGrid(newGrid: FieldGridInfo[], resizedField: FieldGridInfo) {
      let newModifiedFields: FieldGridInfo[] | null = [{ ...resizedField }];

      const resizedFieldIndex = newGrid.findIndex((x) => x.id === resizedField.id);
      const moveDirection =
         resizedField.pos.column + resizedField.size.x - 1 > newGrid[resizedFieldIndex].pos.column + newGrid[resizedFieldIndex].size.x - 1 ? "right" : "down";

      // counter to stop it if it's looping forever (while I fix propagateChanges())
      let counter = 0;
      while (newModifiedFields !== null && counter <= 100) {
         newModifiedFields = propagateChanges(newGrid, gridInfo.size, moveDirection, newModifiedFields!);
         counter++;
      }
      if (counter >= 100) console.log("infinite loop");

      displayFieldsInOrder(newGrid);
      displayGrid(newGrid, gridInfo.size.x);

      dispatch(setGrid(newGrid));
   }

   // updates the actual positioning of fields
   function updatePhysicalGrid(grid: FieldGridInfo[]) {
      for (let i = 0; i < grid.length; i++) {
         const fieldData = grid[i];

         const childIndex = gridInfo.fields.findIndex((x) => x.id === grid[i].id);
         const field = document.getElementById("field-container")?.children[childIndex] as HTMLElement;
         field.style.gridColumn = `${fieldData.pos.column} / span ${fieldData.size.x}`;
         field.style.gridRow = `${fieldData.pos.row} / span ${fieldData.size.y}`;
      }
   }

   function handleMouseUp() {
      if (gridInfo.fieldAction) {
         const resizedField = (document.getElementById("field-container") as HTMLElement).children[gridInfo.fieldAction.index] as HTMLElement;
         resizedField.style.cursor = "grab";
         if (gridInfo.fieldAction.action === "resize") {
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

   function deleteField(index: number) {
      let newGrid = [...gridInfo.grid];
      removeFromGrid(newGrid, index);
      displayGrid(newGrid, gridInfo.size.x);

      let newFields = [...gridInfo.fields];
      newFields.splice(index, 1);
      updatePhysicalGrid(newGrid);

      dispatch(setFieldsAndGrid({ fields: newFields, grid: newGrid }));
   }

   return (
      <div className="grid" onMouseMove={(e) => handleFieldResize(e)} onMouseUp={() => handleMouseUp()} onScroll={() => handleOnScroll()}>
         <div id="field-container" className="field-container">
            {gridInfo.fields.map((field, index) => (
               <Field title={field.title} content={field.content} deleteField={deleteField} index={index} key={index} />
            ))}
         </div>
         <div className="grid-lines-overlay" />
         <AiOutlinePlus className="add-field" onClick={() => dispatch(setFieldAddState(true))}></AiOutlinePlus>
      </div>
   );
}
