import React, { useEffect } from "react";
import { AiOutlinePlus } from "react-icons/ai";

import {
   addToGrid,
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
import { setFieldAction, setFieldAddState, setFields } from "../redux/slices/gridSlice";
import { FieldData, Size } from "../packages/grid/types/FieldTypes";

export default function Grid() {
   const dispatch = useDispatch();
   const grid = useSelector((state: StateType) => state.grid);

   useEffect(() => {
      let newGrid: FieldData[] = [...grid.fields];
      initialiseGridWithFields(newGrid, grid.size, grid.fields.length);
      updateGrid(newGrid);
   }, []);

   useEffect(
      () => handleFieldReposition(),
      [grid.fieldAction && grid.fieldAction.action === "reposition" && grid.fieldAction.targetIndex !== -1 ? grid.fieldAction.index : null]
   );

   // useEffect(() => {
   //    // if a new field has been added
   //    if (grid.fields.length !== 0) {
   //       let newGrid = [...grid.fields];
   //       addToGrid(newGrid, grid.size, "add", grid.fields.length);
   //       updateGrid(newGrid);
   //       setGrid({ size: grid.size, grid: newGrid });
   //    }
   // }, [grid.fields.length]);

   function handleFieldResize(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
      if (grid.fieldAction && grid.fieldAction.action === "resize") {
         const resizedField = (document.getElementById("field-container") as HTMLElement).children[grid.fieldAction.index] as HTMLElement;
         const curGridPos = getGridPosFromFieldPos(resizedField);
         const targetGridPos = getAdjustedGridPosFromMousePos(e, grid.fieldAction.grabbedPos);
         if (grid.fieldAction.grabbedPos !== targetGridPos) {
            dispatch(
               setFieldAction({
                  ...grid.fieldAction,
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
            let newGrid = [...grid.fields];
            updateGrid(newGrid, { ...newGrid[grid.fieldAction.index], size: newFieldSize });
         }
      }
   }

   function handleFieldReposition() {
      if (grid.fieldAction?.action === "reposition") {
         if (grid.fieldAction.targetIndex !== -1) {
            let newGrid = [...grid.fields];
            switchFieldPositions(newGrid, grid.fieldAction.index, grid.fieldAction.targetIndex);
            updateGrid(newGrid);
            dispatch(setFieldAction(null));
         }
      }
   }

   function updateGrid(newGrid: FieldData[], resizedField?: FieldData) {
      if (resizedField) {
         let newModifiedFields: FieldData[] | null = [{ ...resizedField }];

         const resizedFieldIndex = newGrid.findIndex((x) => x.id === resizedField.id);
         const moveDirection =
            resizedField.pos.column + resizedField.size.x - 1 > newGrid[resizedFieldIndex].pos.column + newGrid[resizedFieldIndex].size.x - 1
               ? "right"
               : "down";

         // counter to stop it if it's looping forever (while I fix propagateChanges())
         let counter = 0;
         while (newModifiedFields !== null && counter <= 100) {
            newModifiedFields = propagateChanges(newGrid, grid.size, moveDirection, newModifiedFields!);
            counter++;
         }
         if (counter >= 100) console.log("infinite loop");
      }
      for (let i = 0; i < newGrid.length; i++) {
         const fieldData = newGrid[i];
         const field = document.getElementById("field-container")?.children[i] as HTMLElement;
         field.style.gridColumn = `${fieldData.pos.column} / span ${fieldData.size.x}`;
         field.style.gridRow = `${fieldData.pos.row} / span ${fieldData.size.y}`;
      }
      displayFieldsInOrder(newGrid);
      displayGrid(newGrid, grid.size.x);

      dispatch(setFields(newGrid));
   }

   function handleMouseUp() {
      if (grid.fieldAction) {
         const resizedField = (document.getElementById("field-container") as HTMLElement).children[grid.fieldAction.index] as HTMLElement;
         resizedField.style.cursor = "grab";
         if (grid.fieldAction.action === "resize") {
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
      let newFields = [...grid.fields];
      newFields.splice(index, 1);
      dispatch(setFields(newFields));

      let newGrid = [...grid.fields];
      removeFromGrid(newGrid, index);
      updateGrid(newGrid);
      setFields(newGrid);
   }

   return (
      <div className="grid" onMouseMove={(e) => handleFieldResize(e)} onMouseUp={() => handleMouseUp()} onScroll={() => handleOnScroll()}>
         <div id="field-container" className="field-container">
            {grid.fields.map((field, index) => (
               <Field title={field.title} content={field.content} deleteField={deleteField} index={index} key={index} />
            ))}
         </div>
         <div className="grid-lines-overlay" />
         <AiOutlinePlus className="add-field" onClick={() => dispatch(setFieldAddState(true))}></AiOutlinePlus>
      </div>
   );
}
