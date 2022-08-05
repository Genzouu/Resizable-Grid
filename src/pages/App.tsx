import React, { useEffect, useState } from "react";

import {
   displayFieldsInOrder,
   displayGrid,
   getAdjustedGridPosFromMousePos,
   getGridPosFromFieldPos,
   initialiseGridWithFields,
   propagateChanges,
   switchFieldPositions,
} from "../packages/grid/Grid";
import { FieldData } from "../packages/grid/types/FieldTypes";
import Field from "./Field";
import "../styles/App.scss";
import { useFieldActionContext } from "../context/FieldActionContext";
import { GridField, Size } from "../packages/grid/types/GridTypes";

const testFields: FieldData[] = [
   {
      title: "1",
      body: "",
   },
   {
      title: "2",
      body: "",
   },
   {
      title: "3",
      body: "",
   },
   {
      title: "4",
      body: "",
   },
   {
      title: "5",
      body: "",
   },
   {
      title: "6",
      body: "",
   },
   {
      title: "7",
      body: "",
   },
   {
      title: "8",
      body: "",
   },
];

function App() {
   const { fieldAction, setFieldAction } = useFieldActionContext();

   const [fields, setFields] = useState<FieldData[]>([
      {
         title: "0",
         body: "",
      },
      ...testFields,
   ]);

   const [gridInfo, setGrid] = useState<{ size: Size; grid: GridField[] }>({
      size: { x: 8, y: 30 },
      grid: [],
   });

   useEffect(() => {
      let grid: GridField[] = [];
      initialiseGridWithFields(grid, gridInfo.size, fields.length);

      setGrid({ ...gridInfo, grid: grid });
   }, []);

   useEffect(() => handleFieldReposition(), [fieldAction?.action === "reposition" ? fieldAction.targetField : null]);

   function handleFieldResize(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
      if (fieldAction && fieldAction.action === "resize") {
         const curGridPos = getGridPosFromFieldPos(fieldAction.field);

         const targetGridPos = getAdjustedGridPosFromMousePos(e, fieldAction.grabbedPos);
         if (fieldAction.grabbedPos !== targetGridPos) {
            setFieldAction({
               ...fieldAction,
               grabbedPos: { column: targetGridPos.column, row: targetGridPos.row },
            });
         }

         let newFieldSize: Size = { ...curGridPos.size };
         if (targetGridPos.column !== curGridPos.pos.column + curGridPos.size.x - 1) {
            newFieldSize.x = targetGridPos.column - curGridPos.pos.column + 1;
         }
         if (targetGridPos.row !== curGridPos.pos.row + curGridPos.size.y - 1) {
            newFieldSize.y = targetGridPos.row - curGridPos.pos.row + 1;
         }

         if (curGridPos.size.x !== newFieldSize.x || curGridPos.size.y !== newFieldSize.y) {
            updateGrid(gridInfo.grid, { index: fieldAction.index, pos: curGridPos.pos, size: newFieldSize });
         }
      }
   }

   function handleFieldReposition() {
      if (fieldAction?.action === "reposition") {
         if (fieldAction.targetField) {
            let newGrid = [...gridInfo.grid];
            switchFieldPositions(newGrid, fieldAction.index, fieldAction.targetIndex);
            updateGrid(newGrid);
            setFieldAction(null);
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
      for (let i = 0; i < fields.length; i++) {
         for (let ii = 0; ii < newGrid.length; ii++) {
            if (newGrid[ii].index === i) {
               const fieldData = newGrid[ii];
               const field = document.getElementById("fields-container")?.children[i] as HTMLElement;
               field.style.gridColumn = `${fieldData.pos.column} / span ${fieldData.size.x}`;
               field.style.gridRow = `${fieldData.pos.row} / span ${fieldData.size.y}`;
            }
         }
      }
      displayFieldsInOrder(newGrid);
      displayGrid(newGrid);

      setGrid({ size: gridInfo.size, grid: newGrid });
   }

   function handleMouseUp() {
      if (fieldAction) {
         fieldAction.field.style.cursor = "grab";
         if (fieldAction.action === "resize") {
            (document.getElementsByClassName("grid-lines-overlay")[0] as HTMLElement).style.display = "none";
            setFieldAction(null);
         }
      }
   }

   function handleOnScroll() {
      const app = document.getElementsByClassName("app")[0] as HTMLElement;
      const gridOverlay = document.getElementsByClassName("grid-lines-overlay")[0] as HTMLElement;

      gridOverlay.style.backgroundPositionY = `calc(-7.5px - ${app.scrollTop}px)`;
   }

   return (
      <div className="app" onMouseMove={(e) => handleFieldResize(e)} onMouseUp={() => handleMouseUp()} onScroll={() => handleOnScroll()}>
         <div id="fields-container" className="fields-container">
            {fields.map((field, index) => (
               <Field title={field.title} body={field.body} index={index} key={index} />
            ))}
         </div>
         <div className="grid-lines-overlay" />
      </div>
   );
}

export default App;
