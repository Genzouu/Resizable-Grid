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
import { GridField, ModifiedField, Size } from "../packages/grid/types/GridTypes";

const testFields: FieldData[] = [
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
      title: "Test 1",
      body: "",
   },
   {
      title: "Test 2",
      body: "",
   },
   {
      title: "Test 3",
      body: "",
   },
];

function App() {
   const { fieldAction, setFieldAction } = useFieldActionContext();

   const [fields, setFields] = useState<FieldData[]>([
      {
         title: "About Me",
         body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam mattis, sem sed tristique pulvinar,justo leo porttitor ante, eget gravida ex orci non tellus. Curabitur quis ipsum non arcupellentesque hendrerit non sit amet nisl. Vivamus turpis ligula, faucibus in molestie ac, pretiumsit amet nisl. Nullam augue elit, tempus quis justo id, laoreet fringilla nulla. Donec magnalectus, volutpat sed quam quis, luctus bibendum arcu. Morbi laoreet erat in scelerisque ultricies.Sed turpis risus, rhoncus et bibendum eu, lacinia at felis. Nullam non diam vitae felis fringillafringilla. Vivamus eget erat risus. Proin orci ex, gravida et suscipit ac, varius sed odio. Etiamtempus pulvinar rutrum. Cras finibus arcu vel nunc varius, ac tempor urna lobortis. Sed nullatellus, tempor eget quam ac, varius convallis arcu. Mauris non egestas nulla, quis lobortis libero.Nam sed aliquam nisl, ut elementum sapien. Vestibulum maximus augue quis tellus volutpat facilisis.Cras tristique augue euismod neque imperdiet rutrum. Lorem ipsum dolor sit amet, consecteturadipiscing elit. In eu finibus leo, nec tincidunt elit.",
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

   function updateGrid(grid: GridField[], modifiedField?: GridField) {
      let newGrid = [...grid];
      if (modifiedField) {
         let newModifiedFields: ModifiedField[] | null = [
            { ...modifiedField, wasResized: true },
         ];
         let counter = 0;
         // counter to stop it if it's looping forever (while I fix propagateChanges())
         while (newModifiedFields !== null && counter <= 100) {
            newModifiedFields = propagateChanges(newGrid, gridInfo.size, newModifiedFields!);
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
      setGrid({ size: gridInfo.size, grid: newGrid });
      //displayFieldsInOrder(newGrid);
      displayGrid(newGrid);
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
      <div
         className="app"
         onMouseMove={(e) => handleFieldResize(e)}
         onMouseUp={() => handleMouseUp()}
         onScroll={() => handleOnScroll()}
      >
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
