import React, { useEffect, useState } from "react";

import {
   addFieldToGrid,
   displayGrid,
   getAdjustedGridPosFromMousePos,
   getEmptyGridSpace,
   getFieldsInOrder,
   getGridPosFromFieldPos,
   getNewGridOfSize,
   initialiseGridWithFields,
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
];

export type FieldActionInfo = {
   field: HTMLElement;
   action: "resize" | "reposition";
   grabbedPos: { column: number; row: number };
};

function App() {
   const [fields, setFields] = useState<OptionalField[]>([
      {
         title: "About Me",
         body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam mattis, sem sed tristique pulvinar,justo leo porttitor ante, eget gravida ex orci non tellus. Curabitur quis ipsum non arcupellentesque hendrerit non sit amet nisl. Vivamus turpis ligula, faucibus in molestie ac, pretiumsit amet nisl. Nullam augue elit, tempus quis justo id, laoreet fringilla nulla. Donec magnalectus, volutpat sed quam quis, luctus bibendum arcu. Morbi laoreet erat in scelerisque ultricies.Sed turpis risus, rhoncus et bibendum eu, lacinia at felis. Nullam non diam vitae felis fringillafringilla. Vivamus eget erat risus. Proin orci ex, gravida et suscipit ac, varius sed odio. Etiamtempus pulvinar rutrum. Cras finibus arcu vel nunc varius, ac tempor urna lobortis. Sed nullatellus, tempor eget quam ac, varius convallis arcu. Mauris non egestas nulla, quis lobortis libero.Nam sed aliquam nisl, ut elementum sapien. Vestibulum maximus augue quis tellus volutpat facilisis.Cras tristique augue euismod neque imperdiet rutrum. Lorem ipsum dolor sit amet, consecteturadipiscing elit. In eu finibus leo, nec tincidunt elit.",
      },
      ...testFields,
   ]);

   const [gridInfo, setGrid] = useState<{ size: { x: number; y: number }; grid: number[][] }>({
      size: { x: 8, y: 30 },
      grid: [],
   });
   const [fieldActionInfo, setFieldActionInfo] = useState<FieldActionInfo | null>(null);

   useEffect(() => {
      let grid = getNewGridOfSize(gridInfo.size.x, gridInfo.size.y);
      initialiseGridWithFields(grid, fields.length);
      displayGrid(grid);

      setGrid({ ...gridInfo, grid: grid });
   }, []);

   function manageFieldActions(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
      if (fieldActionInfo) {
         if (fieldActionInfo.action === "resize") {
            const curGridPos = getGridPosFromFieldPos(fieldActionInfo.field);

            const targetGridPos = getAdjustedGridPosFromMousePos(e, fieldActionInfo.grabbedPos);
            if (fieldActionInfo.grabbedPos !== targetGridPos) {
               setFieldActionInfo({
                  field: fieldActionInfo.field,
                  action: fieldActionInfo.action,
                  grabbedPos: { column: targetGridPos.column, row: targetGridPos.row },
               });
            }

            const gridStyle = {
               column: fieldActionInfo.field.style.gridColumn,
               row: fieldActionInfo.field.style.gridRow,
            };

            // resize field
            if (targetGridPos.column >= curGridPos.column.start) {
               fieldActionInfo.field.style.gridColumn = curGridPos.column.start + " / " + (targetGridPos.column + 1);
            }
            if (targetGridPos.row >= curGridPos.row.start) {
               fieldActionInfo.field.style.gridRow = curGridPos.row.start + " / " + (targetGridPos.row + 1);
            }

            // only update the grid if something has changed
            if (
               gridStyle.column !== fieldActionInfo.field.style.gridColumn ||
               gridStyle.row !== fieldActionInfo.field.style.gridRow
            ) {
               updateGrid();
            }
         } else {
            // visually drag the field around
            // when a field is dropped on another, replace contents of those two fields. i.e field 1 is 1x2, field2 is 3x4, if field1 is dropped on field2 their positions and sizes switch
            fieldActionInfo.field.style.top = e.pageY - fieldActionInfo.grabbedPos.row + "px";
            fieldActionInfo.field.style.left = e.pageX - fieldActionInfo.grabbedPos.column + "px";
         }
      }
   }

   function manageFieldResizing(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {}

   function manageFieldRepositioning(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {}

   function updateGrid() {
      const fieldIndexes = getFieldsInOrder(gridInfo.grid);

      const newGrid = getNewGridOfSize(gridInfo.size.x, gridInfo.size.y);
      for (let i = 0; i < fieldIndexes.length; i++) {
         const field = document.getElementById("fields-container")?.children[fieldIndexes[i]] as HTMLElement;
         const fieldPos = getGridPosFromFieldPos(field);

         const newGridPos = getEmptyGridSpace(
            newGrid,
            fieldPos.column.end + 1 - fieldPos.column.start,
            fieldPos.row.end + 1 - fieldPos.row.start
         );
         if (newGridPos) {
            field.style.gridColumn = `${newGridPos.column.start + 1} / ${newGridPos.column.end + 2}`;
            field.style.gridRow = `${newGridPos.row.start + 1} / ${newGridPos.row.end + 2}`;
            addFieldToGrid(newGrid, fieldIndexes[i], newGridPos);
         } // else don't allow the field to be resized because the whole grid is filled
      }

      displayGrid(newGrid);
      setGrid({ size: gridInfo.size, grid: newGrid });
   }

   function handleMouseUp() {
      (document.getElementsByClassName("grid-lines-overlay")[0] as HTMLElement).style.display = "none";
      if (fieldActionInfo) {
         fieldActionInfo.field.style.top = "";
         fieldActionInfo.field.style.left = "";
         fieldActionInfo.field.style.cursor = "grab";
      }
      setFieldActionInfo(null);
   }

   function handleOnScroll() {
      const app = document.getElementsByClassName("app")[0] as HTMLElement;
      const gridOverlay = document.getElementsByClassName("grid-lines-overlay")[0] as HTMLElement;

      gridOverlay.style.backgroundPositionY = `calc(-7.5px - ${app.scrollTop}px)`;
   }

   return (
      <div
         className="app"
         onMouseMove={(e) => manageFieldActions(e)}
         onMouseUp={() => handleMouseUp()}
         onScroll={() => handleOnScroll()}
      >
         <div id="fields-container" className="fields-container">
            {fields.map((field, index) => (
               <Field
                  title={field.title}
                  body={field.body}
                  setFieldActionInfo={setFieldActionInfo}
                  index={index}
                  key={index}
               />
            ))}
         </div>
         <div className="grid-lines-overlay" />
      </div>
   );
}

export default App;
