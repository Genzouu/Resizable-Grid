import React, { useEffect, useState } from "react";

import {
   addFieldToGrid,
   displayGrid,
   findEmptyGridSpace,
   getAdjustedGridPosFromMousePos,
   getFieldsInOrder,
   getGridPosFromFieldPos,
   getNewGridOfSize,
   initialiseGrid,
} from "../types/Grid";
import { OptionalField } from "../types/FieldData";
import Field from "./Field";
import "../styles/App.scss";

const testFields: OptionalField[] = [
   {
      title: "Interests",
      body: ["Coding", "Designing", "Testing", "Debugging"],
   },
   {
      title: "Details",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque lacinia, nisi vel hendrerit vulputate, lectus leo placerat sem, quis convallis arcu libero vel nisl. Nulla vehicula est non mi suscipit, pharetra luctus lectus egestas. Donec eleifend nunc id dui cursus, vel suscipit libero fringilla. Morbi dapibus mauris non faucibus semper. Nulla congue urna at massa efficitur, non elementum magna bibendum. Suspendisse quam turpis, dapibus at gravida id, sodales id mauris. Phasellus faucibus lorem at blandit sagittis. Etiam non mi in purus gravida luctus non eu sapien. Suspendisse tellus elit, sodales sit amet suscipit vitae, egestas eu ex. Phasellus vitae molestie nisl. Nunc rhoncus et neque id egestas. Fusce vel volutpat magna.",
   },
   {
      title: "Details II",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque lacinia, nisi vel hendrerit vulputate, lectus leo placerat sem, quis convallis arcu libero vel nisl. Nulla vehicula est non mi suscipit, pharetra luctus lectus egestas. Donec eleifend nunc id dui cursus, vel suscipit libero fringilla. Morbi dapibus mauris non faucibus semper. Nulla congue urna at massa efficitur, non elementum magna bibendum. Suspendisse quam turpis, dapibus at gravida id, sodales id mauris. Phasellus faucibus lorem at blandit sagittis. Etiam non mi in purus gravida luctus non eu sapien. Suspendisse tellus elit, sodales sit amet suscipit vitae, egestas eu ex. Phasellus vitae molestie nisl. Nunc rhoncus et neque id egestas. Fusce vel volutpat magna. Suspendisse iaculis fermentum eros laoreet convallis. Nam sit amet congue diam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse efficitur nisl malesuada magna convallis, sit amet vulputate eros condimentum. ",
   },
   {
      title: "Favourite Movie Series",
      body: [
         "Lord of the Rings",
         "Star Wars",
         "Harry Potter",
         "Terminator",
         "Indiana Jones",
         "Pirates of the Caribbean",
         "Mission: Impossible",
      ],
   },
   {
      title: "Story",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean lobortis aliquet purus, eget auctor dui mattis vel. Integer aliquam, leo vitae ultrices ultricies, enim nisl pulvinar orci, id congue urna tellus sit amet nulla. Proin neque orci, imperdiet eget tincidunt eget, elementum quis arcu. Nam eleifend non enim ut sodales. Etiam aliquam sit amet urna eu egestas. Nulla in turpis bibendum, pulvinar erat vel, varius massa. Sed id odio vel purus imperdiet luctus non a quam. Phasellus varius in mauris quis faucibus. Nunc posuere turpis lorem, nec bibendum ex porttitor sed. Suspendisse mi urna, porta eget dui in, euismod bibendum eros. Cras posuere, magna ut finibus tempus, augue nibh pharetra nisl, quis posuere tellus dolor vel nisi. Maecenas nec diam tincidunt, suscipit leo vel, pellentesque nisl. Duis semper lectus vel convallis iaculis. Suspendisse iaculis fermentum eros laoreet convallis. Nam sit amet congue diam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse efficitur nisl malesuada magna convallis, sit amet vulputate eros condimentum. Donec porta cursus maximus. Integer volutpat porta egestas. Donec ultrices finibus odio a ultrices. Nam eget nunc elit. Nullam iaculis justo eget pellentesque semper. Curabitur ut gravida tellus. Donec nunc dui, scelerisque quis eleifend vitae, lacinia id ante. Cras orci erat, aliquet non turpis ac, laoreet luctus eros. Curabitur ac lectus justo.",
   },
];

export interface ResizingFieldInfo {
   field: HTMLElement;
   edge: "left" | "right" | "top" | "bottom";
   grabbedPos: { column: number; row: number };
}

function App() {
   const [fields, setFields] = useState<OptionalField[]>([
      {
         title: "About Me",
         body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam mattis, sem sed tristique pulvinar,justo leo porttitor ante, eget gravida ex orci non tellus. Curabitur quis ipsum non arcupellentesque hendrerit non sit amet nisl. Vivamus turpis ligula, faucibus in molestie ac, pretiumsit amet nisl. Nullam augue elit, tempus quis justo id, laoreet fringilla nulla. Donec magnalectus, volutpat sed quam quis, luctus bibendum arcu. Morbi laoreet erat in scelerisque ultricies.Sed turpis risus, rhoncus et bibendum eu, lacinia at felis. Nullam non diam vitae felis fringillafringilla. Vivamus eget erat risus. Proin orci ex, gravida et suscipit ac, varius sed odio. Etiamtempus pulvinar rutrum. Cras finibus arcu vel nunc varius, ac tempor urna lobortis. Sed nullatellus, tempor eget quam ac, varius convallis arcu. Mauris non egestas nulla, quis lobortis libero.Nam sed aliquam nisl, ut elementum sapien. Vestibulum maximus augue quis tellus volutpat facilisis.Cras tristique augue euismod neque imperdiet rutrum. Lorem ipsum dolor sit amet, consecteturadipiscing elit. In eu finibus leo, nec tincidunt elit.",
      },
      ...testFields,
   ]);

   const [gridInfo, setGrid] = useState<{ size: { x: number; y: number }; grid: number[][] }>({
      size: { x: 8, y: 8 },
      grid: [],
   });
   const [resizingFieldInfo, setResizingFieldInfo] = useState<ResizingFieldInfo | null>(null);

   useEffect(() => {
      let grid = getNewGridOfSize(gridInfo.size.x, gridInfo.size.y);
      initialiseGrid(grid, fields.length);
      displayGrid(grid);

      setGrid({ ...gridInfo, grid: grid });
   }, []);

   function manageFieldResizing(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
      if (resizingFieldInfo) {
         const curGridPos = getGridPosFromFieldPos(resizingFieldInfo.field);

         const targetGridPos = getAdjustedGridPosFromMousePos(e, resizingFieldInfo.grabbedPos);
         if (resizingFieldInfo.grabbedPos !== targetGridPos) {
            setResizingFieldInfo({
               field: resizingFieldInfo!.field,
               edge: resizingFieldInfo!.edge,
               grabbedPos: { column: targetGridPos.column, row: targetGridPos.row },
            });
         }

         const gridStyle = {
            column: resizingFieldInfo.field.style.gridColumn,
            row: resizingFieldInfo.field.style.gridRow,
         };

         // add top and left side for dragging and dropping
         switch (resizingFieldInfo.edge) {
            case "right":
            case "bottom":
               if (targetGridPos.column >= curGridPos.column.start) {
                  resizingFieldInfo.field.style.gridColumn =
                     curGridPos.column.start + " / " + (targetGridPos.column + 1);
               }
               if (targetGridPos.row >= curGridPos.row.start) {
                  resizingFieldInfo.field.style.gridRow = curGridPos.row.start + " / " + (targetGridPos.row + 1);
               }
               break;
            default:
               console.log("Invalid edge");
               return;
         }

         // only update the grid if something has changed
         if (
            gridStyle.column !== resizingFieldInfo.field.style.gridColumn ||
            gridStyle.row !== resizingFieldInfo.field.style.gridRow
         ) {
            updateGrid();
         }
      }
   }

   function updateGrid() {
      const fieldIndexes = getFieldsInOrder(gridInfo.grid);

      const newGrid = getNewGridOfSize(gridInfo.size.x, gridInfo.size.y);
      for (let i = 0; i < fieldIndexes.length; i++) {
         const field = document.getElementById("fields-container")?.children[fieldIndexes[i]] as HTMLElement;
         const fieldPos = getGridPosFromFieldPos(field);

         const newGridPos = findEmptyGridSpace(
            newGrid,
            fieldPos.column.end + 1 - fieldPos.column.start,
            fieldPos.row.end + 1 - fieldPos.row.start
         );
         if (newGridPos) {
            field.style.gridColumn = `${newGridPos.column.start + 1} / ${newGridPos.column.end + 2}`;
            field.style.gridRow = `${newGridPos.row.start + 1} / ${newGridPos.row.end + 2}`;
            addFieldToGrid(newGrid, fieldIndexes[i], newGridPos);
         }
      }

      displayGrid(newGrid);
      setGrid({ size: gridInfo.size, grid: newGrid });
   }

   function manageOnMouseUp() {
      if (resizingFieldInfo) resizingFieldInfo.field.style.cursor = "grab";

      setResizingFieldInfo(null);
   }

   return (
      <div className="app">
         <div className="grid-container" onMouseUp={() => manageOnMouseUp()}>
            <div id="fields-container" className="fields-container" onMouseMove={(e) => manageFieldResizing(e)}>
               {fields.map((field, index) => (
                  <Field
                     title={field.title}
                     body={field.body}
                     setResizingFieldInfo={setResizingFieldInfo}
                     index={index}
                     key={index}
                  />
               ))}
            </div>
         </div>
      </div>
   );
}

export default App;
